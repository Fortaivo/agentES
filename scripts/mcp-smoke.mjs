/**
 * Smoke-test the Empire Strike MCP server over stdio:
 * initialize → tools/list → tools/call for each tool with sample args.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const mcpEntry = path.join(repoRoot, 'apps', 'mcp-server', 'dist', 'index.js');

/** @type {Record<string, Record<string, unknown>>} */
const TOOL_ARGS = {
  get_empire_state: {},
  get_city: { cityId: 'c1' },
  get_hero: { heroId: 'h1' },
  get_map: {},
  get_rankings: {},
  get_market: {},
  get_battle_log: {},
  get_action_costs: {},
  get_prison: {},
  build_building: { cityId: 'c1', type: 'granero' },
  attack: { heroId: 'h1', targetCityId: 'e1', regionType: 'misma_region' },
  move_troops: { from: 'c1', to: 'c1', troops: { N1_Guerreros_elfos: 10 } },
  train_troops: { cityId: 'c1', type: 'N1_Guerreros_elfos', quantity: 5 },
  move_hero: { heroId: 'h1', destination: 'Ciudad Principal' },
  do_quest: { heroId: 'h1', questId: 'q1' },
  spy: { targetId: 'e1', heroId: 'h1', type: 'regional' },
  declare_war: { targetClanId: 'clan-enemigo' },
  offer_trade: { resource: 'madera', quantity: 10, pricePerUnit: 1.5 },
  found_city: { regionId: 'reg-llanura', name: 'SmokeTown' },
};

async function runMcpSession() {
  const child = spawn(process.execPath, [mcpEntry], {
    cwd: path.join(repoRoot, 'apps', 'mcp-server'),
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const exitPromise = new Promise((resolveExit) => {
    child.on('close', (code) => resolveExit(code));
  });

  child.stderr.on('data', (c) => {
    process.stderr.write(c);
  });

  let stdoutBuf = '';
  /** @type {Map<number, (msg: unknown) => void>} */
  const pending = new Map();
  let nextId = 0;

  function send(obj) {
    child.stdin.write(`${JSON.stringify(obj)}\n`);
  }

  function request(method, params) {
    const id = ++nextId;
    return new Promise((resolveReq, rejectReq) => {
      const t = setTimeout(() => {
        pending.delete(id);
        rejectReq(new Error(`Timeout waiting for ${method} (id ${id})`));
      }, 25_000);
      pending.set(id, (msg) => {
        clearTimeout(t);
        resolveReq(msg);
      });
      send({ jsonrpc: '2.0', id, method, params });
    });
  }

  child.stdout.on('data', (chunk) => {
    stdoutBuf += chunk.toString('utf8');
    let idx;
    while ((idx = stdoutBuf.indexOf('\n')) >= 0) {
      const line = stdoutBuf.slice(0, idx);
      stdoutBuf = stdoutBuf.slice(idx + 1);
      const trimmed = line.replace(/\r$/, '').trim();
      if (!trimmed) continue;
      let msg;
      try {
        msg = JSON.parse(trimmed);
      } catch {
        continue;
      }
      if (msg && typeof msg === 'object' && 'id' in msg && pending.has(/** @type {any} */ (msg).id)) {
        const rid = /** @type {any} */ (msg).id;
        const cb = pending.get(rid);
        pending.delete(rid);
        cb?.(msg);
      }
    }
  });

  try {
    const init = await request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'mcp-smoke', version: '1.0.0' },
    });
    if (/** @type {any} */ (init).error) {
      throw new Error(`initialize: ${JSON.stringify(/** @type {any} */ (init).error)}`);
    }
    send({ jsonrpc: '2.0', method: 'notifications/initialized' });

    const listed = await request('tools/list', {});
    if (/** @type {any} */ (listed).error) {
      throw new Error(`tools/list: ${JSON.stringify(/** @type {any} */ (listed).error)}`);
    }
    const tools = /** @type {any} */ (listed).result?.tools ?? [];
    const names = tools.map((t) => t.name).sort();
    if (names.length !== 19) {
      throw new Error(`Expected 19 tools, got ${names.length}: ${names.join(', ')}`);
    }

    for (const name of names) {
      const args = TOOL_ARGS[name];
      if (!args) {
        throw new Error(`Add sample args for tool "${name}" in scripts/mcp-smoke.mjs`);
      }
      const called = await request('tools/call', { name, arguments: args });
      if (/** @type {any} */ (called).error) {
        throw new Error(`tools/call ${name}: ${JSON.stringify(/** @type {any} */ (called).error)}`);
      }
      const content = /** @type {any} */ (called).result?.content;
      if (!Array.isArray(content) || !content[0]?.text) {
        throw new Error(`tools/call ${name}: unexpected result shape`);
      }
      let parsed;
      try {
        parsed = JSON.parse(content[0].text);
      } catch {
        throw new Error(`tools/call ${name}: content is not JSON`);
      }
      if (parsed && typeof parsed === 'object' && 'error' in parsed && typeof parsed.error === 'string') {
        throw new Error(`tools/call ${name}: handler error — ${parsed.error}`);
      }
      if (parsed && typeof parsed === 'object' && 'exito' in parsed && parsed.exito === false) {
        throw new Error(`tools/call ${name}: exito false — ${parsed.error ?? JSON.stringify(parsed)}`);
      }
    }

    child.stdin.end();
    const code = await exitPromise;
    if (code !== 0) {
      throw new Error(`MCP process exited with code ${code}`);
    }
    return names;
  } catch (e) {
    child.kill();
    await exitPromise.catch(() => {});
    throw e;
  }
}

try {
  await runMcpSession();
  console.log('MCP smoke: OK (19 tools called).');
  process.exit(0);
} catch (e) {
  console.error('MCP smoke failed:', e instanceof Error ? e.message : e);
  process.exit(1);
}
