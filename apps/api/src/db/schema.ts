import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  nombreUsuario: text('nombre_usuario').notNull(),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  emailUnique: uniqueIndex('users_email_unique').on(table.email),
  usernameUnique: uniqueIndex('users_nombre_usuario_unique').on(table.nombreUsuario)
}));

export const empires = pgTable('empires', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  nombreImperio: text('nombre_imperio').notNull(),
  raza: text('raza').notNull(),
  nivel: integer('nivel').notNull().default(1),
  turnos: integer('turnos').notNull().default(0),
  turnosGastadosHoy: integer('turnos_gastados_hoy').notNull().default(0),
  diaTemporada: integer('dia_temporada').notNull().default(1),
  ranking: integer('ranking').notNull().default(0),
  puntos: integer('puntos').notNull().default(0),
  pais: text('pais').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userUnique: uniqueIndex('empires_user_id_unique').on(table.userId)
}));

export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  empireId: text('empire_id').notNull().references(() => empires.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  tipoTerreno: text('tipo_terreno').notNull(),
  poblacion: integer('poblacion').notNull().default(0),
  felicidad: integer('felicidad').notNull().default(0),
  moral: integer('moral').notNull().default(0),
  corrupcion: integer('corrupcion').notNull().default(0),
  higiene: integer('higiene').notNull().default(0),
  religion: integer('religion').notNull().default(0),
  cultura: integer('cultura').notNull().default(0),
  coordX: integer('coord_x').notNull().default(0),
  coordY: integer('coord_y').notNull().default(0),
  limiteTropas: integer('limite_tropas').notNull().default(0),
  impuestos: integer('impuestos').notNull().default(0),
  produccionDiaria: jsonb('produccion_diaria').$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
  consumoDiario: jsonb('consumo_diario').$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const cityBuildings = pgTable('city_buildings', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull(),
  nivel: integer('nivel').notNull().default(1),
  nivelMaximo: integer('nivel_maximo').notNull().default(10),
  enConstruccion: boolean('en_construccion').notNull().default(false),
  construccionTerminaEn: timestamp('construccion_termina_en', { withTimezone: true })
});

export const cityTroops = pgTable('city_troops', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull(),
  cantidad: integer('cantidad').notNull().default(0)
});

export const heroes = pgTable('heroes', {
  id: text('id').primaryKey(),
  empireId: text('empire_id').notNull().references(() => empires.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  clase: text('clase').notNull(),
  raza: text('raza').notNull(),
  nivel: integer('nivel').notNull().default(1),
  experiencia: integer('experiencia').notNull().default(0),
  experienciaSiguienteNivel: integer('experiencia_siguiente_nivel').notNull().default(100),
  ubicacionTipo: text('ubicacion_tipo').notNull(),
  ubicacionId: text('ubicacion_id').notNull(),
  ubicacionNombre: text('ubicacion_nombre').notNull(),
  protegido: boolean('protegido').notNull().default(false),
  tieneMontura: boolean('tiene_montura').notNull().default(false),
  capturado: boolean('capturado').notNull().default(false),
  ataque: integer('ataque').notNull().default(0),
  defensa: integer('defensa').notNull().default(0),
  dano: integer('dano').notNull().default(0),
  vida: integer('vida').notNull().default(0),
  velocidad: integer('velocidad').notNull().default(0),
  moral: integer('moral').notNull().default(0),
  puntosDesarrollo: integer('puntos_desarrollo').notNull().default(0),
  habilidades: jsonb('habilidades').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const resourceBalances = pgTable('resource_balances', {
  empireId: text('empire_id').primaryKey().references(() => empires.id, { onDelete: 'cascade' }),
  oro: integer('oro').notNull().default(0),
  comida: integer('comida').notNull().default(0),
  madera: integer('madera').notNull().default(0),
  piedra: integer('piedra').notNull().default(0),
  hierro: integer('hierro').notNull().default(0),
  mana: integer('mana').notNull().default(0),
  plata: integer('plata').notNull().default(0),
  herramientas: integer('herramientas').notNull().default(0),
  armas: integer('armas').notNull().default(0),
  bloques: integer('bloques').notNull().default(0),
  tablas: integer('tablas').notNull().default(0),
  cristal: integer('cristal').notNull().default(0),
  reliquias: integer('reliquias').notNull().default(0),
  joyeria: integer('joyeria').notNull().default(0),
  karma: integer('karma').notNull().default(0),
  mithril: integer('mithril').notNull().default(0),
  gemas: integer('gemas').notNull().default(0),
  agua: integer('agua').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const actionLogs = pgTable('action_logs', {
  id: text('id').primaryKey(),
  empireId: text('empire_id').notNull().references(() => empires.id, { onDelete: 'cascade' }),
  actionType: text('action_type').notNull(),
  description: text('description').notNull(),
  turnsSpent: integer('turns_spent').notNull().default(0),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  result: jsonb('result').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const usersRelations = relations(users, ({ one }) => ({
  empire: one(empires, {
    fields: [users.id],
    references: [empires.userId]
  })
}));

export const empiresRelations = relations(empires, ({ many, one }) => ({
  user: one(users, {
    fields: [empires.userId],
    references: [users.id]
  }),
  cities: many(cities),
  heroes: many(heroes),
  logs: many(actionLogs),
  resourceBalance: one(resourceBalances, {
    fields: [empires.id],
    references: [resourceBalances.empireId]
  })
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  empire: one(empires, {
    fields: [cities.empireId],
    references: [empires.id]
  }),
  buildings: many(cityBuildings),
  troops: many(cityTroops)
}));

export const cityBuildingsRelations = relations(cityBuildings, ({ one }) => ({
  city: one(cities, {
    fields: [cityBuildings.cityId],
    references: [cities.id]
  })
}));

export const cityTroopsRelations = relations(cityTroops, ({ one }) => ({
  city: one(cities, {
    fields: [cityTroops.cityId],
    references: [cities.id]
  })
}));

export const heroesRelations = relations(heroes, ({ one }) => ({
  empire: one(empires, {
    fields: [heroes.empireId],
    references: [empires.id]
  })
}));

export const resourceBalancesRelations = relations(resourceBalances, ({ one }) => ({
  empire: one(empires, {
    fields: [resourceBalances.empireId],
    references: [empires.id]
  })
}));

export const actionLogsRelations = relations(actionLogs, ({ one }) => ({
  empire: one(empires, {
    fields: [actionLogs.empireId],
    references: [empires.id]
  })
}));
