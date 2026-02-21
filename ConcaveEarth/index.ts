import { MCPServer, object, text, widget } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "ConcaveEarth",
  title: "ConcaveEarth", // display name
  version: "1.0.0",
  description: "MCP server with MCP Apps integration",
  baseUrl: process.env.MCP_URL || "http://localhost:3000", // Full base URL (e.g., https://myserver.com)
  favicon: "favicon.ico",
  websiteUrl: "https://mcp-use.com", // Can be customized later
  icons: [
    {
      src: "icon.svg",
      mimeType: "image/svg+xml",
      sizes: ["512x512"],
    },
  ],
});

const landmarks = [
  {
    id: "sf",
    name: "San Francisco",
    country: "United States",
    type: "city",
    lat: 37.7749,
    lng: -122.4194,
    facts: [
      "Known for steep streets and layered waterfront topography.",
      "Works well as a map UX benchmark because neighborhoods are geographically compact.",
    ],
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    type: "city",
    lat: 37.5665,
    lng: 126.978,
    facts: [
      "Dense transit network and high POI density make filtering demos useful.",
      "A good stress-test for marker clustering behavior.",
    ],
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    type: "city",
    lat: -1.2921,
    lng: 36.8219,
    facts: [
      "Often used in global demos to validate equatorial perspective handling.",
      "Has strong contrast between urban center and surrounding natural zones.",
    ],
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    type: "city",
    lat: 51.5072,
    lng: -0.1276,
    facts: [
      "The Thames curve is visually recognizable even in stylized map themes.",
      "Useful for testing high-latitude rendering balance in northern hemisphere views.",
    ],
  },
  {
    id: "andes",
    name: "Andes Backbone",
    country: "South America",
    type: "terrain",
    lat: -19.0154,
    lng: -65.2619,
    facts: [
      "Represents long mountain-chain scale for distance/ratio storytelling.",
      "Good for comparing city-to-terrain proportions inside a spherical projection.",
    ],
  },
  {
    id: "greatbarrierreef",
    name: "Great Barrier Reef",
    country: "Australia",
    type: "terrain",
    lat: -18.2871,
    lng: 147.6992,
    facts: [
      "Helpful for testing ocean-heavy camera views and sparse marker sets.",
      "A strong example of non-urban mapping context.",
    ],
  },
];

server.tool(
  {
    name: "open-concave-earth",
    description:
      "Open an inside-the-Earth map experience where the user looks around the globe interior",
    schema: z.object({
      focus: z
        .string()
        .optional()
        .describe("Optional keyword to prioritize landmarks in the initial view"),
    }),
    widget: {
      name: "product-search-result",
      invoking: "Preparing the Earth interior...",
      invoked: "Concave Earth ready",
    },
  },
  async ({ focus }) => {
    const results = landmarks
      .filter((item) => {
        if (!focus) return true;
        const term = focus.toLowerCase();
        return (
          item.name.toLowerCase().includes(term) ||
          item.country.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term)
        );
      })
      .map(({ facts, ...marker }) => marker);

    const initial = results[0] ?? landmarks[0];

    return widget({
      props: {
        title: "Concave Earth Navigator",
        focus: focus ?? "",
        camera: {
          lat: initial.lat,
          lng: initial.lng,
          fov: 78,
        },
        markers: results,
      },
      output: text(`Loaded ${results.length} landmark nodes for concave view`),
    });
  }
);

server.tool(
  {
    name: "get-landmark-details",
    description: "Get details for a landmark shown in the concave Earth viewer",
    schema: z.object({
      id: z.string().describe("The landmark id"),
    }),
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      country: z.string(),
      type: z.string(),
      lat: z.number(),
      lng: z.number(),
      facts: z.array(z.string()),
    }),
  },
  async ({ id }) => {
    const found = landmarks.find((item) => item.id === id);
    if (!found) {
      return object({
        id,
        name: "Unknown location",
        country: "Unknown",
        type: "unknown",
        lat: 0,
        lng: 0,
        facts: ["No landmark details found."],
      });
    }

    return object({
      id: found.id,
      name: found.name,
      country: found.country,
      type: found.type,
      lat: found.lat,
      lng: found.lng,
      facts: found.facts,
    });
  }
);

server.listen().then(() => {
  console.log(`Server running`);
});
