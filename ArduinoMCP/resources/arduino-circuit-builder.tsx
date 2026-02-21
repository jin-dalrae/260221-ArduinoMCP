import { McpUseProvider, useWidget, type WidgetMetadata } from "mcp-use/react";
import { useMemo } from "react";
import { z } from "zod";
import "./styles.css";

const componentSchema = z.object({
  name: z.string(),
  qty: z.number(),
  purchaseUrl: z.string(),
});

const propsSchema = z.object({
  prompt: z.string(),
  filename: z.string(),
  code: z.string(),
  diagramTitle: z.string(),
  diagramNotes: z.array(z.string()),
  components: z.array(componentSchema),
});

export const widgetMetadata: WidgetMetadata = {
  description:
    "Minimal Arduino circuit workspace with code, logical schematic preview, and components",
  props: propsSchema,
  exposeAsTool: false,
  metadata: {
    invoking: "Preparing circuit builder workspace...",
    invoked: "Circuit builder workspace ready",
  },
};

type Props = z.infer<typeof propsSchema>;
type HighlightToken = {
  text: string;
  kind: "plain" | "keyword" | "number" | "comment" | "preprocessor";
};

const keywords = new Set([
  "void",
  "int",
  "float",
  "bool",
  "byte",
  "const",
  "if",
  "else",
  "for",
  "while",
  "return",
  "digitalWrite",
  "digitalRead",
  "analogRead",
  "analogWrite",
  "pinMode",
  "delay",
  "HIGH",
  "LOW",
  "INPUT",
  "OUTPUT",
  "setup",
  "loop",
]);

function highlightLine(line: string): HighlightToken[] {
  const trimmed = line.trimStart();

  if (trimmed.startsWith("//")) {
    return [{ text: line, kind: "comment" }];
  }

  if (trimmed.startsWith("#")) {
    return [{ text: line, kind: "preprocessor" }];
  }

  return line.split(/(\s+|\b)/).map((part) => {
    if (keywords.has(part)) {
      return { text: part, kind: "keyword" };
    }

    if (/^\d+$/.test(part)) {
      return { text: part, kind: "number" };
    }

    return { text: part, kind: "plain" };
  });
}

export default function ArduinoCircuitBuilderWidget() {
  const { props, isPending } = useWidget<Props>();

  const highlightedCode = useMemo(
    () => (isPending ? [] : props.code.split("\n").map((line) => highlightLine(line))),
    [isPending, props]
  );

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="acb-root">
          <div className="acb-loading">Loading Arduino circuit workspace...</div>
        </div>
      </McpUseProvider>
    );
  }

  const diagramComponents = props.components.slice(0, 4);

  return (
    <McpUseProvider autoSize>
      <div className="acb-root">
        <header className="acb-header">
          <div>
            <h1>Arduino Circuit Workspace</h1>
            <p>{props.prompt}</p>
          </div>
          <span className="acb-badge">{props.filename}</span>
        </header>

        <div className="acb-layout">
          <aside className="acb-sidebar card">
            <h2>Components</h2>
            <ul>
              {props.components.map((component) => (
                <li key={`${component.name}-${component.purchaseUrl}`}>
                  <div>
                    <strong>{component.name}</strong>
                    <span>Qty {component.qty}</span>
                  </div>
                  <a href={component.purchaseUrl} target="_blank" rel="noreferrer">
                    Buy
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <section className="acb-code card">
            <div className="acb-section-head">
              <h2>.ino Code</h2>
              <span className="acb-chip">Generated</span>
            </div>
            <pre>
              {highlightedCode.map((tokens, lineIndex) => (
                <div key={`line-${lineIndex}`}>
                  {tokens.map((token, tokenIndex) => (
                    <span
                      key={`token-${lineIndex}-${tokenIndex}`}
                      className={`acb-token-${token.kind}`}
                    >
                      {token.text}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </section>

          <section className="acb-preview card">
            <div className="acb-section-head">
              <h2>{props.diagramTitle}</h2>
              <div className="acb-legend">
                <span className="acb-legend-item acb-legend-power">VCC</span>
                <span className="acb-legend-item acb-legend-ground">GND</span>
                <span className="acb-legend-item acb-legend-signal">SIG</span>
              </div>
            </div>

            <svg viewBox="0 0 560 290" role="img" aria-label="Logical circuit schematic preview">
              <line x1="30" y1="40" x2="530" y2="40" className="acb-wire-power" />
              <text x="34" y="30" className="acb-diagram-note">VCC</text>

              <line x1="30" y1="250" x2="530" y2="250" className="acb-wire-ground" />
              <text x="34" y="271" className="acb-diagram-note">GND</text>

              <rect x="40" y="95" width="170" height="105" rx="8" className="acb-diagram-board" />
              <text x="125" y="132" textAnchor="middle" className="acb-diagram-label">
                Arduino Uno
              </text>
              <text x="125" y="154" textAnchor="middle" className="acb-diagram-note">
                D13 / 5V / GND
              </text>

              {diagramComponents.map((component, index) => {
                const y = 76 + index * 48;
                const signalY = y + 20;
                return (
                  <g key={`diagram-${component.name}`}>
                    <rect x="360" y={y} width="165" height="40" rx="8" className="acb-diagram-part" />
                    <text x="442" y={y + 24} textAnchor="middle" className="acb-diagram-label">
                      {component.name}
                    </text>

                    <line x1="210" y1="148" x2="360" y2={signalY} className="acb-wire-signal" />

                    <line x1="392" y1={y} x2="392" y2="40" className="acb-wire-power" />
                    <line x1="493" y1={y + 40} x2="493" y2="250" className="acb-wire-ground" />

                    <circle cx="392" cy={y} r="3" className="acb-node" />
                    <circle cx="493" cy={y + 40} r="3" className="acb-node" />
                  </g>
                );
              })}
            </svg>

            <ul>
              {props.diagramNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </McpUseProvider>
  );
}
