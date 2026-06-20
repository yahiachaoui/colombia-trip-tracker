# 🇨🇴 Voyage Colombie — suivi pré-voyage

Petite web app **mobile-first** et collaborative pour préparer notre voyage : qui
fait quoi (tâches), ce qu'il reste à réserver/payer, et le budget global. Données
partagées et synchronisées en **temps réel** via Supabase. **Pas de login** : on
choisit son nom au lancement.

> Phase 1 : suivi pré-voyage (tâches + budget). Phase 2 : programme jour par jour.

## Stack

- **Vite + React + TypeScript**
- **Supabase** (Postgres + Realtime, free tier) — lecture **et** écriture côté client
- Déploiement **Vercel** ou **Netlify**

## Fonctionnalités

- **Choix du nom** au lancement (mémorisé localement, modifiable via le bouton en
  haut à droite). Auto-service : chacun peut s'ajouter avec son/ses rôle(s)
  (voyageur, organisateur).
- **Mon espace** : mes tâches perso, les tâches collectives, mes tâches
  d'organisation (si organisateur), et « À réserver / payer » (mes dépenses + statut).
- **Budget** : coût total + estimation par voyageur, filtres par catégorie (Vols,
  Logements, Transport, Activités, Nourriture, Autre), et bouton
  « Régler les comptes sur Tricount → ». La réconciliation des comptes se fait dans
  Tricount, pas dans l'app.
- **Programme** (phase 2) : itinéraire jour par jour à dates réelles. Chaque jour
  (date + ville) contient des lignes typées à icône — Transport ✈️, Logement 🏨,
  Visite 📍, Repas 🍽️, Autre — avec texte libre et lien optionnel.

## Mise en route locale

```bash
npm install
cp .env.example .env.local   # puis renseigne tes valeurs Supabase
npm run dev
```

Sans variables d'environnement, l'app affiche un message de configuration plutôt
que de planter.

## Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com) (free tier).
2. Dans **SQL Editor**, exécute le contenu de [`supabase/schema.sql`](supabase/schema.sql).
   Cela crée toutes les tables (`personnes`, `taches`, `depenses`, `config`, `jours`,
   `activites`), active le Realtime et les policies d'accès.
   - *Déjà installé en phase 1 ?* Exécute seulement
     [`supabase/phase2.sql`](supabase/phase2.sql) pour ajouter `jours` et `activites`.
3. Dans **Project Settings → API**, récupère :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Renseigne ces deux valeurs dans `.env.local` (local) **et** dans les variables
   d'environnement de ta plateforme de déploiement.

> 🔒 La clé `anon` est publique côté client : c'est normal. N'utilise **jamais** la
> clé `service_role` ici. Comme il n'y a pas de login, l'accès aux données repose sur
> le fait que l'URL de l'app reste **non-listée** et partagée à un groupe restreint.
> N'y stocke pas de données sensibles.

## Déploiement

### Vercel
- Importe le repo, framework **Vite** (détecté). Build `npm run build`, output `dist`.
- Ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans *Environment Variables*.
- `vercel.json` est déjà fourni.

### Netlify
- `netlify.toml` est déjà fourni (build `npm run build`, publish `dist`, redirects SPA).
- Ajoute les deux variables d'environnement dans *Site settings → Environment*.

Partage l'URL (non-listée) au groupe. 🎒

## Lien Tricount

Une fois le Tricount créé, colle son URL directement depuis l'écran **Budget**
(le bouton propose un champ s'il n'est pas encore défini). Elle est stockée dans la
table `config` et partagée à tout le monde.
