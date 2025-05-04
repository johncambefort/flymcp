import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MetarResponse } from "./types/metar";
import { serializeMetar } from "./serialize/metar";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const AVIATION_WEATHER_BASE = "https://aviationweather.gov/api/data";
const USER_AGENT = "flymcp/1.0";

const server = new McpServer({
  name: "metar",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeWeatherRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}, ${response.body}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error making request: ${error}`);
    return null;
  }
}

server.tool(
  "get-metar",
  "Get the METAR weather information for an ICAO id",
  {
    icaoId: z
      .string()
      .length(4)
      .describe("Four-letter ICAO id code, e.g. KBOS"),
  },
  async ({ icaoId }) => {
    const icaoIdCode = icaoId.toUpperCase();
    const metarUrl = `${AVIATION_WEATHER_BASE}/metar?ids=${icaoIdCode}&format=json&taf=false`;
    const metarResponses = await makeWeatherRequest<MetarResponse[]>(metarUrl);

    if (!metarResponses || metarResponses.length == 0) {
      return {
        content: [{ type: "text", text: "Failed to retrieve METAR data" }],
      };
    }

    const metarData = metarResponses[0];
    const serialized = serializeMetar(metarData);
    return {
      content: [
        {
          type: "text",
          text: serialized,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
