create table if not exists users (
  id text primary key,
  email text not null,
  nombre_usuario text not null,
  password_hash text,
  created_at timestamptz not null default now()
);

create unique index if not exists users_email_unique on users (email);
create unique index if not exists users_nombre_usuario_unique on users (nombre_usuario);

create table if not exists empires (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  nombre_imperio text not null,
  raza text not null,
  nivel integer not null default 1,
  turnos integer not null default 0,
  turnos_gastados_hoy integer not null default 0,
  dia_temporada integer not null default 1,
  ranking integer not null default 0,
  puntos integer not null default 0,
  pais text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists empires_user_id_unique on empires (user_id);

create table if not exists cities (
  id text primary key,
  empire_id text not null references empires(id) on delete cascade,
  nombre text not null,
  tipo_terreno text not null,
  poblacion integer not null default 0,
  felicidad integer not null default 0,
  moral integer not null default 0,
  corrupcion integer not null default 0,
  higiene integer not null default 0,
  religion integer not null default 0,
  cultura integer not null default 0,
  coord_x integer not null default 0,
  coord_y integer not null default 0,
  limite_tropas integer not null default 0,
  impuestos integer not null default 0,
  produccion_diaria jsonb not null default '{}'::jsonb,
  consumo_diario jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists city_buildings (
  id text primary key,
  city_id text not null references cities(id) on delete cascade,
  tipo text not null,
  nivel integer not null default 1,
  nivel_maximo integer not null default 10,
  en_construccion boolean not null default false,
  construccion_termina_en timestamptz
);

create table if not exists city_troops (
  id text primary key,
  city_id text not null references cities(id) on delete cascade,
  tipo text not null,
  cantidad integer not null default 0
);

create table if not exists heroes (
  id text primary key,
  empire_id text not null references empires(id) on delete cascade,
  nombre text not null,
  clase text not null,
  raza text not null,
  nivel integer not null default 1,
  experiencia integer not null default 0,
  experiencia_siguiente_nivel integer not null default 100,
  ubicacion_tipo text not null,
  ubicacion_id text not null,
  ubicacion_nombre text not null,
  protegido boolean not null default false,
  tiene_montura boolean not null default false,
  capturado boolean not null default false,
  ataque integer not null default 0,
  defensa integer not null default 0,
  dano integer not null default 0,
  vida integer not null default 0,
  velocidad integer not null default 0,
  moral integer not null default 0,
  puntos_desarrollo integer not null default 0,
  habilidades jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists resource_balances (
  empire_id text primary key references empires(id) on delete cascade,
  oro integer not null default 0,
  comida integer not null default 0,
  madera integer not null default 0,
  piedra integer not null default 0,
  hierro integer not null default 0,
  mana integer not null default 0,
  plata integer not null default 0,
  herramientas integer not null default 0,
  armas integer not null default 0,
  bloques integer not null default 0,
  tablas integer not null default 0,
  cristal integer not null default 0,
  reliquias integer not null default 0,
  joyeria integer not null default 0,
  karma integer not null default 0,
  mithril integer not null default 0,
  gemas integer not null default 0,
  agua integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists action_logs (
  id text primary key,
  empire_id text not null references empires(id) on delete cascade,
  action_type text not null,
  description text not null,
  turns_spent integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
