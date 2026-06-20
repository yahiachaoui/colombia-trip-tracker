-- ============================================================================
-- Phase 2 — Programme jour par jour
-- À exécuter dans le SQL Editor SI tu as déjà lancé schema.sql (phase 1).
-- Statements additifs et idempotents. (Pour une install fraîche, schema.sql
-- contient déjà ces tables.)
-- ============================================================================

-- Jours : date réelle + ville/lieu.
create table if not exists jours (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  lieu text not null default '',
  created_at timestamptz not null default now()
);

-- Lignes (activités) d'un jour : type à icône + texte libre + lien optionnel.
create table if not exists activites (
  id uuid primary key default gen_random_uuid(),
  jour_id uuid not null references jours(id) on delete cascade,
  type text not null check (type in ('transport', 'logement', 'visite', 'repas', 'autre')),
  texte text not null,
  lien text,
  created_at timestamptz not null default now()
);

-- Realtime
alter publication supabase_realtime add table jours;
alter publication supabase_realtime add table activites;

-- RLS : accès complet via la clé anon (cohérent avec la phase 1).
alter table jours     enable row level security;
alter table activites enable row level security;

create policy "acces_complet_jours" on jours
  for all to anon, authenticated using (true) with check (true);

create policy "acces_complet_activites" on activites
  for all to anon, authenticated using (true) with check (true);
