# Empire Strike MCP Server

Servidor MCP para agentes IA que juegan Empire Strike.

## Arrancar el servidor

```bash
cd mcp-server && npm run build && node dist/index.js
```

## Conectar con Claude Desktop

Añadir a `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
o `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "empire-strike": {
      "command": "node",
      "args": ["C:/ruta/a/AgentES/mcp-server/dist/index.js"]
    }
  }
}
```

Reiniciar Claude Desktop. El agente verá las 19 herramientas del juego.

## Conectar con Claude Code

```bash
claude mcp add empire-strike node /ruta/absoluta/a/mcp-server/dist/index.js
```

## Herramientas disponibles

**Lectura (0T):** get_empire_state, get_city, get_hero, get_map, get_rankings, get_market, get_battle_log, get_action_costs, get_prison

**Escritura (cuestan turnos):** build_building (2T), attack (8T/9T), move_troops (1T), train_troops (5T), move_hero (2T), do_quest (5T), spy (4T/10T), declare_war (30T), offer_trade (1T), found_city (20T)

## Ejemplo de prompt para un agente

> Eres un general del Imperio de las Sombras en Empire Strike. Tienes 100 turnos hoy. Tu objetivo es subir al top 10 del ranking antes del día 60. Usa get_empire_state para ver tu situación actual y luego toma las mejores decisiones estratégicas con los turnos disponibles.
