import { McpUseProvider, useCallTool, useWidget, type WidgetMetadata } from "mcp-use/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import type { ProductSearchResultProps } from "./types";
import { propSchema } from "./types";

type LandmarkDetails = {
  id: string;
  name: string;
  country: string;
  type: string;
  lat: number;
  lng: number;
  facts: string[];
};

type Vec3 = { x: number; y: number; z: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const wrapLng = (lng: number) => {
  let next = lng;
  while (next > 180) next -= 360;
  while (next < -180) next += 360;
  return next;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const latLngToVec = (lat: number, lng: number): Vec3 => {
  const latR = degToRad(lat);
  const lngR = degToRad(lng);
  const cosLat = Math.cos(latR);
  return {
    x: cosLat * Math.cos(lngR),
    y: Math.sin(latR),
    z: cosLat * Math.sin(lngR),
  };
};

const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;

const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const normalize = (v: Vec3): Vec3 => {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
};

const projectMarker = ({
  point,
  cameraLat,
  cameraLng,
  fov,
  aspect,
}: {
  point: Vec3;
  cameraLat: number;
  cameraLng: number;
  fov: number;
  aspect: number;
}) => {
  const forward = latLngToVec(cameraLat, cameraLng);
  const worldUp: Vec3 = Math.abs(forward.y) > 0.98 ? { x: 0, y: 0, z: 1 } : { x: 0, y: 1, z: 0 };
  const right = normalize(cross(forward, worldUp));
  const up = normalize(cross(right, forward));

  const xCam = dot(point, right);
  const yCam = dot(point, up);
  const zCam = dot(point, forward);

  if (zCam <= 0) {
    return { visible: false };
  }

  const tanHalfFov = Math.tan(degToRad(fov) / 2);
  const nx = xCam / (zCam * tanHalfFov * aspect);
  const ny = yCam / (zCam * tanHalfFov);

  if (Math.abs(nx) > 1.15 || Math.abs(ny) > 1.15) {
    return { visible: false };
  }

  return {
    visible: true,
    xPercent: (nx * 0.5 + 0.5) * 100,
    yPercent: (-ny * 0.5 + 0.5) * 100,
    depth: zCam,
  };
};

export const widgetMetadata: WidgetMetadata = {
  description:
    "An inside-the-globe map viewer with draggable camera controls and landmark inspection.",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: false,
    invoking: "Building the concave Earth surface...",
    invoked: "Concave Earth viewer loaded",
  },
};

const ProductSearchResult: React.FC = () => {
  const { props, isPending, sendFollowUpMessage } = useWidget<ProductSearchResultProps>();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const [cameraLat, setCameraLat] = useState(0);
  const [cameraLng, setCameraLng] = useState(0);
  const [fov, setFov] = useState(78);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [aspect, setAspect] = useState(16 / 10);

  const {
    callTool: getLandmarkDetails,
    data: detailsData,
    isPending: detailsPending,
  } = useCallTool("get-landmark-details" as never);

  const title = props?.title ?? "Concave Earth Navigator";
  const focus = props?.focus ?? "";
  const camera = props?.camera ?? { lat: 0, lng: 0, fov: 78 };
  const markers = props?.markers ?? [];

  const details = detailsData?.structuredContent as LandmarkDetails | undefined;

  useEffect(() => {
    if (!props) return;
    setCameraLat(camera.lat);
    setCameraLng(camera.lng);
    setFov(camera.fov);
    setSelectedId(markers[0]?.id ?? null);
  }, [camera.fov, camera.lat, camera.lng, markers, props]);

  useEffect(() => {
    if (!selectedId) return;
    (getLandmarkDetails as unknown as (args: { id: string }) => void)({ id: selectedId });
  }, [getLandmarkDetails, selectedId]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setAspect(width / Math.max(height, 1));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoRotate) return;
    const timer = setInterval(() => {
      setCameraLng((prev) => wrapLng(prev + 0.12));
    }, 25);
    return () => clearInterval(timer);
  }, [isAutoRotate]);

  const projected = useMemo(() => {
    return markers
      .map((marker) => {
        const projection = projectMarker({
          point: latLngToVec(marker.lat, marker.lng),
          cameraLat,
          cameraLng,
          fov,
          aspect,
        });
        return {
          marker,
          projection,
        };
      })
      .filter((item) => item.projection.visible)
      .sort((a, b) => (b.projection.depth ?? 0) - (a.projection.depth ?? 0));
  }, [aspect, cameraLat, cameraLng, fov, markers]);

  if (isPending || !props) {
    return (
      <McpUseProvider>
        <div className="concave-shell">
          <div className="concave-loading" />
        </div>
      </McpUseProvider>
    );
  }

  return (
    <McpUseProvider>
      <div className="concave-shell">
        <header className="concave-header">
          <p className="concave-kicker">Manufact + Google Maps MCP ready UI</p>
          <h2>{title}</h2>
          <p className="concave-subtitle">
            Drag to look around from Earth&apos;s center. Scroll to zoom field-of-view.
            {focus ? ` Initial focus: ${focus}.` : ""}
          </p>
        </header>

        <section
          className="concave-viewport"
          ref={viewportRef}
          onPointerDown={(event) => {
            dragRef.current = { x: event.clientX, y: event.clientY };
            setIsAutoRotate(false);
          }}
          onPointerMove={(event) => {
            if (!dragRef.current) return;
            const dx = event.clientX - dragRef.current.x;
            const dy = event.clientY - dragRef.current.y;
            dragRef.current = { x: event.clientX, y: event.clientY };
            setCameraLng((prev) => wrapLng(prev - dx * 0.14));
            setCameraLat((prev) => clamp(prev + dy * 0.1, -89.5, 89.5));
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerLeave={() => {
            dragRef.current = null;
          }}
          onWheel={(event) => {
            event.preventDefault();
            setFov((prev) => clamp(prev + event.deltaY * 0.03, 35, 108));
          }}
        >
          <div className="concave-surface" />
          <div className="concave-grid" />
          {projected.map(({ marker, projection }) => (
            <button
              key={marker.id}
              className={`concave-marker ${selectedId === marker.id ? "is-selected" : ""}`}
              style={{
                left: `${projection.xPercent}%`,
                top: `${projection.yPercent}%`,
              }}
              onClick={() => setSelectedId(marker.id)}
            >
              <span className="concave-dot" />
              <span className="concave-label">{marker.name}</span>
            </button>
          ))}

          <div className="concave-overlay">
            <span>{cameraLat.toFixed(2)} lat</span>
            <span>{cameraLng.toFixed(2)} lng</span>
            <span>{fov.toFixed(0)} fov</span>
          </div>
        </section>

        <footer className="concave-footer">
          <button
            className="control-btn"
            onClick={() => setIsAutoRotate((prev) => !prev)}
          >
            {isAutoRotate ? "Pause Spin" : "Auto Spin"}
          </button>
          <button
            className="control-btn"
            onClick={() => {
              setCameraLat(camera.lat);
              setCameraLng(camera.lng);
              setFov(camera.fov);
            }}
          >
            Reset View
          </button>
          <button
            className="control-btn"
            onClick={() =>
              sendFollowUpMessage(
                `Suggest a travel route that connects ${markers
                  .slice(0, 3)
                  .map((m) => m.name)
                  .join(", ")} with practical flight legs`
              )
            }
          >
            Ask AI Route
          </button>
        </footer>

        <aside className="concave-details">
          {detailsPending && <p>Loading landmark details...</p>}
          {!detailsPending && details && (
            <>
              <h3>{details.name}</h3>
              <p className="meta">
                {details.country} · {details.type}
              </p>
              <p className="meta">
                {details.lat.toFixed(4)}, {details.lng.toFixed(4)}
              </p>
              <ul>
                {details.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </McpUseProvider>
  );
};

export default ProductSearchResult;
