# Empire Strike - Documentación del Proyecto

## Descripción General

Empire Strike es un juego de estrategia militar en tiempo real inspirado en el juego original. Los jugadores controlan imperios completos, gestionan ciudades, entrenan héroes, construyen ejércitos y participan en combates estratégicos contra otros jugadores.

## Arquitectura del Proyecto

### Frontend (Completado)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS con tema personalizado medieval/fantasy
- **Iconos**: Lucide React
- **Estado**: React Hooks (useState, useEffect)

### Estructura de Archivos
```
src/
├── components/
│   ├── Sidebar.tsx          # Navegación lateral principal
│   └── ResourceBar.tsx      # Barra superior de recursos
├── pages/
│   ├── LoginPage.tsx        # Autenticación y registro
│   ├── Dashboard.tsx        # Panel principal del imperio
│   ├── Heroes.tsx           # Gestión de héroes
│   ├── Cities.tsx           # Gestión de ciudades
│   ├── Troops.tsx           # Movimiento de tropas
│   ├── Combat.tsx           # Resultados de combate
│   ├── Rankings.tsx         # Rankings globales
│   ├── Trade.tsx            # Sistema de comercio
│   └── Profile.tsx          # Perfil del jugador
└── App.tsx                  # Componente principal
```

## Funcionalidades Implementadas (Frontend)

### ✅ Sistema de Autenticación
- Página de login/registro con diseño medieval
- Integración visual para Facebook/Google
- Información del juego y capturas de pantalla
- Rankings en tiempo real en la página de inicio

### ✅ Dashboard Principal
- Resumen del imperio con estadísticas clave
- Actividad reciente del jugador
- Estado general del imperio (felicidad, moral, economía)
- Alertas y notificaciones importantes

### ✅ Gestión de Héroes
- Lista de héroes con información detallada
- Sistema de características (ataque, defensa, daño, vida, velocidad, moral)
- Mejoras de héroes con costos en gemas
- Acciones disponibles (mover tropas, aventuras, quests)
- Sistema de experiencia y niveles

### ✅ Gestión de Ciudades
- Vista detallada de cada ciudad
- Sistema de construcción de edificios
- Estadísticas de población y felicidad
- Gestión de tropas por ciudad
- Producción y consumo de recursos

### ✅ Sistema de Tropas
- Interfaz para mover tropas entre ubicaciones
- Gestión de capacidades y límites
- Diferentes tipos de unidades (Guerreros, Arqueros, Centauros, Exploradores)
- Cálculo de porcentajes de capacidad

### ✅ Sistema de Combate
- Resultados detallados de batallas
- Análisis round por round
- Estadísticas finales de tropas
- Información de ganadores/perdedores

### ✅ Rankings
- Rankings por categorías (General, Militar, Económico, Héroes)
- Información de países y razas
- Tendencias de posición
- Estadísticas personales del jugador

### ✅ Sistema de Comercio
- Mercado de recursos
- Gestión de ofertas propias
- Historial de transacciones
- Estadísticas de comercio

### ✅ Perfil de Jugador
- Información personal y estadísticas
- Sistema de logros
- Configuración de cuenta
- Estadísticas detalladas de juego

## Backlog de Desarrollo (Backend y Funcionalidades)

### 🔴 CRÍTICO - Sistema de Autenticación y Usuarios

#### Backend de Autenticación
- [ ] Implementar registro de usuarios con email/contraseña
- [ ] Sistema de login con JWT tokens
- [ ] Integración con OAuth (Facebook, Google)
- [ ] Validación de emails y recuperación de contraseñas
- [ ] Sistema de sesiones y seguridad

#### Base de Datos de Usuarios
```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  country VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Tabla de perfiles de jugador
CREATE TABLE player_profiles (
  user_id UUID REFERENCES users(id),
  empire_name VARCHAR NOT NULL,
  race VARCHAR NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  join_date TIMESTAMP DEFAULT NOW(),
  total_gold_earned BIGINT DEFAULT 0,
  battles_won INTEGER DEFAULT 0,
  battles_lost INTEGER DEFAULT 0
);
```

### 🔴 CRÍTICO - Sistema de Recursos y Economía

#### Backend de Recursos
- [ ] Sistema de recursos base (oro, comida, madera, piedra, hierro, gemas)
- [ ] Cálculo de producción y consumo en tiempo real
- [ ] Sistema de turnos y tiempo de juego
- [ ] Límites de almacenamiento y capacidades

#### Base de Datos de Recursos
```sql
-- Tabla de recursos del jugador
CREATE TABLE player_resources (
  user_id UUID REFERENCES users(id),
  gold BIGINT DEFAULT 1000,
  food BIGINT DEFAULT 1000,
  wood BIGINT DEFAULT 500,
  stone BIGINT DEFAULT 500,
  iron BIGINT DEFAULT 100,
  gems BIGINT DEFAULT 50,
  population BIGINT DEFAULT 100,
  culture BIGINT DEFAULT 0,
  mana BIGINT DEFAULT 50,
  experience BIGINT DEFAULT 50,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de producción de recursos
CREATE TABLE resource_production (
  user_id UUID REFERENCES users(id),
  resource_type VARCHAR NOT NULL,
  production_rate INTEGER DEFAULT 0,
  consumption_rate INTEGER DEFAULT 0,
  last_calculated TIMESTAMP DEFAULT NOW()
);
```

### 🔴 CRÍTICO - Sistema de Ciudades

#### Backend de Ciudades
- [ ] Creación y gestión de ciudades
- [ ] Sistema de terrenos y ubicaciones
- [ ] Límites de población y tropas
- [ ] Cálculo de felicidad y moral

#### Base de Datos de Ciudades
```sql
-- Tabla de ciudades
CREATE TABLE cities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  terrain_type VARCHAR NOT NULL,
  population INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  x_coordinate INTEGER,
  y_coordinate INTEGER,
  founded_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de edificios
CREATE TABLE buildings (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES cities(id),
  building_type VARCHAR NOT NULL,
  level INTEGER DEFAULT 1,
  max_level INTEGER DEFAULT 10,
  construction_started TIMESTAMP,
  construction_completed TIMESTAMP,
  is_built BOOLEAN DEFAULT false
);

-- Tipos de edificios predefinidos
CREATE TABLE building_types (
  type VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  base_cost_gold INTEGER,
  base_cost_wood INTEGER,
  base_cost_stone INTEGER,
  production_bonus TEXT
);
```

### 🔴 CRÍTICO - Sistema de Héroes

#### Backend de Héroes
- [ ] Creación y gestión de héroes
- [ ] Sistema de características y mejoras
- [ ] Sistema de experiencia y niveles
- [ ] Habilidades especiales y clases

#### Base de Datos de Héroes
```sql
-- Tabla de héroes
CREATE TABLE heroes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  class VARCHAR NOT NULL,
  race VARCHAR NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  location_type VARCHAR, -- 'city' o 'field'
  location_id UUID,
  is_protected BOOLEAN DEFAULT false,
  has_mount BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de características de héroes
CREATE TABLE hero_stats (
  hero_id UUID REFERENCES heroes(id),
  attack INTEGER DEFAULT 10,
  defense INTEGER DEFAULT 10,
  damage INTEGER DEFAULT 7,
  life INTEGER DEFAULT 19,
  speed INTEGER DEFAULT 8,
  moral INTEGER DEFAULT 8,
  development_points INTEGER DEFAULT 0
);

-- Tabla de clases de héroes
CREATE TABLE hero_classes (
  class VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  base_attack INTEGER,
  base_defense INTEGER,
  base_damage INTEGER,
  base_life INTEGER,
  base_speed INTEGER,
  base_moral INTEGER
);
```

### 🔴 CRÍTICO - Sistema de Tropas

#### Backend de Tropas
- [ ] Gestión de diferentes tipos de tropas
- [ ] Sistema de movimiento entre ubicaciones
- [ ] Cálculo de capacidades y límites
- [ ] Bonificaciones por terreno y edificios

#### Base de Datos de Tropas
```sql
-- Tabla de tropas
CREATE TABLE troops (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  troop_type VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  location_type VARCHAR, -- 'city', 'hero', 'field'
  location_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de tipos de tropas
CREATE TABLE troop_types (
  type VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  level INTEGER NOT NULL,
  race VARCHAR NOT NULL,
  attack INTEGER,
  defense INTEGER,
  damage INTEGER,
  life INTEGER,
  speed INTEGER,
  cost_gold INTEGER,
  cost_food INTEGER,
  training_time INTEGER -- en minutos
);

-- Tabla de movimientos de tropas
CREATE TABLE troop_movements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  from_location_type VARCHAR,
  from_location_id UUID,
  to_location_type VARCHAR,
  to_location_id UUID,
  troop_data JSONB, -- {troop_type: quantity}
  started_at TIMESTAMP DEFAULT NOW(),
  arrives_at TIMESTAMP,
  status VARCHAR DEFAULT 'moving' -- 'moving', 'arrived', 'cancelled'
);
```

### 🟡 IMPORTANTE - Sistema de Combate

#### Backend de Combate
- [ ] Motor de combate con cálculos de daño
- [ ] Sistema de rounds y turnos
- [ ] Algoritmos de IA para combate automático
- [ ] Registro detallado de batallas

#### Base de Datos de Combate
```sql
-- Tabla de batallas
CREATE TABLE battles (
  id UUID PRIMARY KEY,
  attacker_id UUID REFERENCES users(id),
  defender_id UUID REFERENCES users(id),
  battle_type VARCHAR, -- 'hero_vs_hero', 'hero_vs_city', 'city_siege'
  target_id UUID,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  winner_id UUID REFERENCES users(id),
  battle_data JSONB -- rounds, acciones, resultados
);

-- Tabla de participantes en batalla
CREATE TABLE battle_participants (
  battle_id UUID REFERENCES battles(id),
  user_id UUID REFERENCES users(id),
  side VARCHAR, -- 'attacker', 'defender'
  troops_before JSONB,
  troops_after JSONB,
  heroes_involved UUID[]
);
```

### 🟡 IMPORTANTE - Sistema de Rankings

#### Backend de Rankings
- [ ] Cálculo de puntuaciones por categorías
- [ ] Sistema de actualización en tiempo real
- [ ] Histórico de posiciones
- [ ] Premios y recompensas por temporada

#### Base de Datos de Rankings
```sql
-- Tabla de puntuaciones
CREATE TABLE player_scores (
  user_id UUID REFERENCES users(id),
  general_score INTEGER DEFAULT 0,
  military_score INTEGER DEFAULT 0,
  economic_score INTEGER DEFAULT 0,
  hero_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Tabla de histórico de rankings
CREATE TABLE ranking_history (
  user_id UUID REFERENCES users(id),
  category VARCHAR,
  position INTEGER,
  score INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

### 🟡 IMPORTANTE - Sistema de Comercio

#### Backend de Comercio
- [ ] Mercado global de recursos
- [ ] Sistema de ofertas y demandas
- [ ] Cálculo automático de precios
- [ ] Historial de transacciones

#### Base de Datos de Comercio
```sql
-- Tabla de ofertas de mercado
CREATE TABLE market_offers (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  resource_type VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR DEFAULT 'active' -- 'active', 'sold', 'expired', 'cancelled'
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  offer_id UUID REFERENCES market_offers(id),
  resource_type VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### 🟢 OPCIONAL - Funcionalidades Avanzadas

#### Sistema de Clanes/Alianzas
- [ ] Creación y gestión de clanes
- [ ] Chat interno de clan
- [ ] Guerras entre clanes
- [ ] Beneficios de membresía

#### Sistema de Quests y Aventuras
- [ ] Misiones diarias y semanales
- [ ] Aventuras para héroes
- [ ] Recompensas y experiencia
- [ ] Cadenas de misiones épicas

#### Sistema de Mapas y Exploración
- [ ] Mapa mundial interactivo
- [ ] Exploración de territorios
- [ ] Recursos especiales en el mapa
- [ ] Eventos aleatorios

#### Sistema de Eventos
- [ ] Eventos temporales
- [ ] Competiciones especiales
- [ ] Recompensas exclusivas
- [ ] Calendarios de eventos

## APIs Necesarias

### Autenticación
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/profile
```

### Recursos
```typescript
GET /api/resources
POST /api/resources/collect
GET /api/resources/production
```

### Ciudades
```typescript
GET /api/cities
POST /api/cities
GET /api/cities/:id
PUT /api/cities/:id
POST /api/cities/:id/buildings
PUT /api/cities/:id/buildings/:buildingId
```

### Héroes
```typescript
GET /api/heroes
POST /api/heroes
GET /api/heroes/:id
PUT /api/heroes/:id/stats
POST /api/heroes/:id/move
POST /api/heroes/:id/adventure
```

### Tropas
```typescript
GET /api/troops
POST /api/troops/move
GET /api/troops/movements
POST /api/troops/train
```

### Combate
```typescript
POST /api/combat/attack
GET /api/combat/battles
GET /api/combat/battles/:id
```

### Rankings
```typescript
GET /api/rankings/:category
GET /api/rankings/player/:userId
```

### Comercio
```typescript
GET /api/market/offers
POST /api/market/offers
DELETE /api/market/offers/:id
POST /api/market/buy/:offerId
GET /api/market/transactions
```

## Consideraciones Técnicas

### Seguridad
- [ ] Validación de entrada en todas las APIs
- [ ] Rate limiting para prevenir spam
- [ ] Encriptación de contraseñas con bcrypt
- [ ] Tokens JWT con expiración
- [ ] Validación de permisos en cada acción

### Performance
- [ ] Índices en base de datos para consultas frecuentes
- [ ] Cache de rankings y estadísticas
- [ ] Paginación en listas largas
- [ ] Optimización de consultas SQL

### Escalabilidad
- [ ] Arquitectura de microservicios
- [ ] Base de datos distribuida
- [ ] Sistema de colas para tareas pesadas
- [ ] CDN para assets estáticos

## Cronograma Estimado

### Fase 1 (2-3 semanas) - MVP Básico
- Sistema de autenticación
- Gestión básica de recursos
- Ciudades y edificios básicos
- Héroes con stats básicos

### Fase 2 (2-3 semanas) - Funcionalidades Core
- Sistema de tropas completo
- Motor de combate básico
- Rankings básicos
- Comercio simple

### Fase 3 (2-3 semanas) - Funcionalidades Avanzadas
- Sistema de combate avanzado
- Comercio completo
- Optimizaciones de performance
- Sistema de eventos

### Fase 4 (1-2 semanas) - Pulido y Testing
- Testing completo
- Optimizaciones finales
- Documentación de APIs
- Deploy a producción

## Tecnologías Recomendadas para Backend

### Base de Datos
- **PostgreSQL** - Para datos relacionales complejos
- **Redis** - Para cache y sesiones
- **InfluxDB** - Para métricas y estadísticas (opcional)

### Backend Framework
- **Node.js + Express** - Rápido desarrollo, buena integración con frontend
- **Python + FastAPI** - Excelente para cálculos complejos y IA
- **Go + Gin** - Alta performance para muchos usuarios concurrentes

### Infraestructura
- **Docker** - Containerización
- **AWS/GCP/Azure** - Cloud hosting
- **Nginx** - Load balancer y proxy reverso
- **GitHub Actions** - CI/CD

## Métricas y Monitoreo

### KPIs del Juego
- [ ] Usuarios activos diarios/mensuales
- [ ] Tiempo promedio de sesión
- [ ] Retención de usuarios (1 día, 7 días, 30 días)
- [ ] Transacciones de comercio por día
- [ ] Batallas por día
- [ ] Progresión de niveles

### Métricas Técnicas
- [ ] Tiempo de respuesta de APIs
- [ ] Uptime del sistema
- [ ] Uso de recursos del servidor
- [ ] Errores y excepciones
- [ ] Throughput de requests

---

*Documentación generada para Empire Strike - Versión 1.0*
*Última actualización: Diciembre 2024*