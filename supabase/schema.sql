-- ============================================================================
-- Schéma Supabase — Suivi pré-voyage Colombie
-- À exécuter une fois dans le SQL Editor de ton projet Supabase.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Personnes : un nom + un ou plusieurs rôles ('voyageur', 'organisateur').
create table if not exists personnes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  roles text[] not null default '{voyageur}',
  created_at timestamptz not null default now()
);

-- Tâches : perso / collective / organisation.
--   assigne_a = null pour une tâche collective (concerne tout le monde).
create table if not exists taches (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  type text not null check (type in ('perso', 'collective', 'organisation')),
  assigne_a uuid references personnes(id) on delete set null,
  fait boolean not null default false,
  echeance date,
  lien text,
  created_at timestamptz not null default now()
);

-- Dépenses : items du budget (vols, logements, etc.).
create table if not exists depenses (
  id uuid primary key default gen_random_uuid(),
  libelle text not null,
  categorie text not null,
  responsable uuid references personnes(id) on delete set null,
  prix numeric(10, 2) not null default 0,
  paye boolean not null default false,
  lien text,
  created_at timestamptz not null default now()
);

-- Config globale : une seule ligne (id = 1), stocke le lien du Tricount partagé.
create table if not exists config (
  id int primary key default 1,
  lien_tricount text,
  constraint config_single check (id = 1)
);

insert into config (id, lien_tricount)
values (1, null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Realtime : diffuser les changements à tous les clients connectés.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table personnes;
alter publication supabase_realtime add table taches;
alter publication supabase_realtime add table depenses;
alter publication supabase_realtime add table config;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Pas de login : on autorise l'accès complet via la clé anon.
-- Acceptable car l'URL de l'app est non-listée et partagée à un groupe restreint.
-- N'y stocke pas de données sensibles.
-- ---------------------------------------------------------------------------
alter table personnes enable row level security;
alter table taches    enable row level security;
alter table depenses  enable row level security;
alter table config    enable row level security;

-- Lecture + écriture pour les rôles anon (clé publique) et authenticated.
create policy "acces_complet_personnes" on personnes
  for all to anon, authenticated using (true) with check (true);

create policy "acces_complet_taches" on taches
  for all to anon, authenticated using (true) with check (true);

create policy "acces_complet_depenses" on depenses
  for all to anon, authenticated using (true) with check (true);

-- Config : lecture + mise à jour autorisées (pas de delete utile).
create policy "lecture_config" on config
  for select to anon, authenticated using (true);

create policy "maj_config" on config
  for update to anon, authenticated using (true) with check (true);
