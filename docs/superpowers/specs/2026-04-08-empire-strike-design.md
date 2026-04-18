# Empire Strike — Diseño del Proyecto
**Fecha:** 2026-04-08  
**Estado:** Aprobado  
**Enfoque:** Enfoque B — Frontend completo + Servidor MCP

---

## 1. Visión General

Empire Strike es un juego de estrategia militar por turnos donde **jugadores humanos y agentes de IA compiten en igualdad de condiciones**. Los humanos juegan a través de la interfaz web en español. Los agentes IA (Claude, GPT-4o, modelos locales, OpenClaw, etc.) juegan a través de un servidor MCP que expone las acciones del juego como herramientas.

### Principio fundamental
Humanos y agentes IA llaman al mismo backend REST. El servidor MCP es únicamente una capa de traducción: convierte llamadas a herramientas MCP en peticiones HTTP idénticas a las que hace el frontend. No hay APIs especiales para bots — mismas reglas, mismos turnos, misma economía.

### Restricción de idioma
**Todo el texto visible para el jugador va en español**: UI, botones, mensajes de error, respuestas del servidor MCP, logs de acción de agentes, notificaciones.

---

## 2. Arquitectura del Sistema

```
┌─────────────────┐         ┌──────────────────────────┐
│  JUGADORES      │         │  AGENTES IA               │
│  HUMANOS        │         │  (Claude/GPT/OpenClaw/    │
│  Navegador web  │         │   modelos locales)         │
└────────┬────────┘         └────────────┬─────────────┘
         │ HTTP / React                  │ MCP Protocol
         ▼                               ▼
┌─────────────────┐         ┌──────────────────────────┐
│  React Frontend │         │  Servidor MCP (nuevo)     │
│  (TypeScript)   │         │  (TypeScript / Node.js)   │
│                 │         │                           │
│  17 páginas     │         │  9 herramientas lectura   │
│  en español     │         │  10 herramientas escritura│
└────────┬────────┘         └────────────┬─────────────┘
         │                               │
         └──────────────┬────────────────┘
                        │ REST API (compartido)
                        ▼
         ┌──────────────────────────────┐
         │  Contratos TypeScript        │
         │  types/game.ts               │
         │  types/api.ts                │
         │  types/mcp.ts                │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │  Backend (a construir)        │
         │  Node/Python/Go · PostgreSQL  │
         │  · Redis                      │
         └──────────────────────────────┘
```

---

## 3. Sistema de Turnos

Los turnos son el limitador de velocidad natural que equilibra humanos vs agentes IA.

| Acción | Costo |
|--------|-------|
| Mensajes, acciones administrativas | 0T |
| Mover tropas, aventuras, comerciar oro, montar héroes | 1T |
| Construir edificios, mover héroes entre regiones, cambiar impuestos, políticas | 2T |
| Asedios, contraataques, espionaje regional | 4T |
| Comprar tropas, completar quests, magia de clan, comprar monturas | 5T |
| Ataque regional (misma región) | 8T |
| Ataque regional (región adyacente) | 9T |
| Espionaje de reconquista, reclutar héroe capturado | 10T |
| Fundar ciudad, comprar héroe | 20T |
| Declarar guerra | 30T |
| Fundar clan | 50T |

**Generación diaria:** 100 turnos base a las 22:00 UTC. Bonus: +1T por cada 20 edificios construidos por ciudad, +1T por cada 10 victorias de héroe.

**Duración de la temporada:** 60 días (2 meses).

**El contador de turnos aparece visiblemente en la barra de recursos de todas las páginas**, con desglose del gasto diario.

---

## 4. Páginas Frontend

### 4.1 Páginas existentes — Refinar

Todas las páginas existentes mantienen su estructura actual. Cambios a aplicar en todas:

- Añadir **insignias de coste de turnos** (`2T`, `8T`) en cada botón de acción
- Mostrar **razas correctas** (Elfos, Elfos Oscuros, Enanos, Humanos, No Muertos, Orcos)
- Los recursos del juego en la barra (18 confirmados en wiki, posiblemente 19 — verificar con backend): Oro, Comida, Madera, Piedra, Hierro, Maná, Plata, Herramientas, Armas, Bloques, Tablas, Cristal, Reliquias, Joyería, Karma, Mithril, Gemas, Agua

| Página | Mejoras clave |
|--------|--------------|
| **Dashboard** | Contador de turnos + gráfico de gasto diario + temporizador de temporada (60 días) |
| **Héroes** | Insignias de turno en acciones · Motivación de héroe (requiere mínimo de tropas por nivel) · 4 clases: Guerrero/Ladrón/Sacerdote/Mago |
| **Ciudades** | Cola de construcción · 33 tipos de edificios · Insignias 2T en construcción · Estadísticas de producción de recursos |
| **Tropas** | Insignias 1T mover, 5T entrenar · Movimientos activos en progreso · Niveles N1–N45 · Tipos de ataque |
| **Combate** | Insignias 8T/9T/4T · Historial de batallas · Rondas detalladas · Estado de captura de héroe |
| **Rankings** | Temporizador de temporada · 4 categorías · Historial de posición |
| **Comercio** | Nota: Maná y Karma no son comerciables · Insignia 1T · 17 recursos disponibles |
| **Perfil** | Historial semanal de uso de turnos (gráfico) · Estadísticas de temporada |

### 4.2 Páginas nuevas — Construir desde cero

#### Mapa Mundial
Vista interactiva del mundo (Gaia / Leza / Jadpian). Muestra territorios, ciudades propias, posiciones de héroes, movimientos enemigos detectados. Click en territorio para atacar o explorar. Insignias de turno en todas las acciones.

#### Clanes
Crear clan (50T, coste 200.000 oro, requiere 300 puntos de valor). Unirse a clan existente. Lista de miembros y rangos. Diplomacia: declarar guerra (30T), formar alianza. Magia de clan (5T). Rutas de comercio internas. Actividad reciente del clan.

#### Espionaje
Misiones de espionaje sobre ciudades y héroes enemigos. Espionaje regional (4T) · Espionaje de reconquista (10T). Resultados de misión con informe de inteligencia. Vista de contraespionaje. Historial de misiones.

#### Política
Ajustes de política (2T): tasa impositiva, política religiosa, actitud diplomática (guerra / neutral / amistoso). Gestión de alianzas. Estado diplomático con cada imperio. Circulares de clan.

#### Prisión
Héroes enemigos capturados: fijar precio de rescate, reclutar héroe capturado (10T). Tus héroes capturados: pagar rescate para liberarlos. Estado de negociación de rescate.

#### Monturas
Comprar monturas (5T) que aumentan velocidad/capacidad del héroe. Tipos de montura por raza. Asignar montura a héroe. Mercado de monturas.

#### Quests y Aventuras
Completar quest (5T) · Aventura (1T). Misiones basadas en héroes para obtener oro/recursos/XP. Quests diarias, cadenas épicas, registro de aventuras. Estado de motivación del héroe.

#### Carromato
Transportar recursos entre tus ciudades via carromato. Programar entregas. Ver estado del tránsito. Límites de capacidad.

#### Imperios Agente *(característica única de este proyecto)*
Configura y gestiona imperios controlados por IA:
- Añadir nuevo agente: nombre del imperio, raza, modelo IA (Claude/GPT/local), estrategia (Agresiva/Económica/Defensiva/Equilibrada), relación (Enemigo/Aliado)
- Para cada agente activo: ranking actual, turnos usados hoy, log de últimas 5 acciones con coste en turnos
- Botón "Ver razonamiento": muestra el proceso de decisión del agente
- Acciones: Pausar, Reanudar, Resetear, Proponer alianza, Romper alianza
- Conexión via MCP: el agente se autentica con un token del juego, mismo sistema que cualquier jugador

---

## 5. Servidor MCP

### Herramientas de Lectura (0 turnos)

| Herramienta | Retorna |
|-------------|---------|
| `get_empire_state()` | turnos, recursos (19 tipos), ciudades, héroes, tropas, ranking, día_temporada |
| `get_city(city_id)` | edificios (33 tipos), tropas, población, felicidad, tasas de producción |
| `get_hero(hero_id)` | stats, nivel, XP, ubicación, tropas lideradas, montura, estado de captura |
| `get_map(region?)` | imperios cercanos, territorios, posiciones enemigas, zonas de recursos |
| `get_rankings()` | top jugadores, puntuaciones, día de temporada, días restantes |
| `get_market(resource?)` | ofertas activas, precios, tus ofertas, transacciones recientes |
| `get_battle_log()` | ataques recientes recibidos, tus ataques, resultados, bajas |
| `get_action_costs()` | coste en turnos de cada acción (los agentes planifican su presupuesto) |
| `get_prison()` | héroes enemigos capturados, precios de rescate, tus héroes en cautiverio |

### Herramientas de Escritura (cuestan turnos)

| Herramienta | Turnos | Descripción |
|-------------|--------|-------------|
| `build_building(city_id, type, level?)` | 2T | Construye o mejora un edificio |
| `attack(hero_id, target_city_id)` | 8T/9T | Lanza ataque (8T misma región, 9T adyacente) |
| `move_troops(from, to, troops)` | 1T | Reposiciona tropas entre ciudades/héroes |
| `train_troops(city_id, type, qty)` | 5T | Compra tropas |
| `move_hero(hero_id, destination)` | 2T | Mueve héroe entre regiones/ciudades |
| `do_quest(hero_id, quest_id)` | 5T | Envía héroe a quest |
| `spy(target_id, hero_id, type)` | 4T/10T | Ejecuta espionaje |
| `declare_war(target_clan_id)` | 30T | Declara guerra a un clan |
| `offer_trade(resource, qty, price)` | 1T | Publica oferta en el mercado |
| `found_city(region_id, name)` | 20T | Funda una nueva ciudad |

### Formato de respuesta universal

Toda herramienta de escritura retorna:
```json
{
  "success": true,
  "turnos_gastados": 8,
  "turnos_restantes": 65,
  "resultado": { },
  "dia_temporada": 14,
  "sugerencias": ["La Armería aumentaría tu defensa un 12%"]
}
```

`turnos_restantes` en cada respuesta permite que los agentes se autorregulen sin límites artificiales de API. `sugerencias` es metadata opcional — se puede ajustar por tier de agente.

---

## 6. Contratos TypeScript Compartidos

Tres archivos de tipos que actúan como contrato entre frontend, MCP y backend:

- **`src/types/game.ts`** — Recursos, Edificios, Héroes, Tropas, Batallas, Ciudades, Razas
- **`src/types/api.ts`** — Formas de request/response para cada endpoint REST
- **`src/types/mcp.ts`** — Parámetros y respuestas de herramientas MCP

Estos archivos se definen antes de cualquier implementación y son la fuente de verdad única.

---

## 7. Secuencia de Construcción

### Fase 1 — Contratos y fundación (no bloqueable)
1. Crear `src/types/game.ts`, `src/types/api.ts`, `src/types/mcp.ts`
2. Actualizar `ResourceBar` con los 19 recursos y contador de turnos
3. Actualizar `Sidebar` con todas las rutas nuevas (estructura del juego real)
4. Añadir `.gitignore` entry para `.superpowers/`

### Fase 2 — Refinar páginas existentes
Aplicar insignias de turnos y correcciones de datos a las 8 páginas existentes.

### Fase 3 — Páginas nuevas (en orden de prioridad)
1. Mapa Mundial — alta prioridad, característica visual central
2. Clanes — alta prioridad, multiplayer social core
3. Espionaje
4. Política
5. Prisión
6. Monturas
7. Quests y Aventuras
8. Carromato
9. Imperios Agente — última, depende de MCP listo

### Fase 4 — Servidor MCP
1. Scaffold del servidor MCP (Node.js + `@modelcontextprotocol/sdk`)
2. Implementar las 9 herramientas de lectura contra datos mock
3. Implementar las 10 herramientas de escritura contra datos mock
4. Página Imperios Agente en el frontend conectada al servidor MCP
5. Test de integración: conectar Claude como agente de prueba

---

## 8. Fuera de Alcance (para este plan)

- Backend real (base de datos, lógica de negocio)
- Autenticación OAuth (Facebook/Google)
- Sincronización en tiempo real (WebSockets)
- Notificaciones push (Slack/Discord via OpenClaw)
- Motor de combate real
- Sistema de temporadas con premios

Estas características se construyen después de que el backend externo esté listo y se integra con los contratos TypeScript definidos en la Fase 1.
