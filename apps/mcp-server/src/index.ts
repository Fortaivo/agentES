// mcp-server/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { herramientasLectura } from './tools/read-tools.js';
import { herramientasEscritura } from './tools/write-tools.js';

const servidor = new McpServer({
  name: 'empire-strike',
  version: '1.0.0',
});

const TOKEN_DEMO = 'demo-token';

for (const h of herramientasLectura) {
  servidor.registerTool(
    h.nombre,
    { description: h.descripcion, inputSchema: h.schema },
    async (args) => {
      try {
        const resultado = h.ejecutar(args as Record<string, unknown>, TOKEN_DEMO);
        return {
          content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
          isError: true,
        };
      }
    }
  );
}

for (const h of herramientasEscritura) {
  servidor.registerTool(
    h.nombre,
    { description: h.descripcion, inputSchema: h.schema },
    async (args) => {
      try {
        const resultado = h.ejecutar(args as Record<string, unknown>, TOKEN_DEMO);
        return {
          content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const transporte = new StdioServerTransport();
  await servidor.connect(transporte);
  console.error('Empire Strike MCP Server arrancado. Herramientas: 9 lectura + 10 escritura.');
}

main().catch(console.error);
