# CLAUDINE

> **Plateforme d'échange d'avantages employés** — Connecte les employés du retail pour qu'ils échangent leurs réductions entre enseignes.

---

## Table des matières

1. [Aperçu](#aperçu)
2. [Stack technique](#stack-technique)
3. [Arborescence du projet](#arborescence-du-projet)
4. [Prérequis](#prérequis)
5. [Installation locale](#installation-locale)
6. [Variables d'environnement](#variables-denvironnement)
7. [Base de données](#base-de-données)
8. [Scripts disponibles](#scripts-disponibles)
9. [Architecture](#architecture)
10. [Fonctionnalités](#fonctionnalités)
11. [Tests](#tests)
12. [Déploiement](#déploiement)

---

## Aperçu

CLAUDINE est une application web full-stack permettant aux employés du retail de :

- Créer un profil avec leur enseigne, leur taux de réduction et les enseignes qu'ils recherchent
- Découvrir d'autres membres avec qui échanger leurs avantages
- Chatter en temps réel avec les membres qui les intéressent

Le thème visuel est basé sur une palette **bordeaux `#5C0029`** et **rose poudré `#F3E4EC`**, avec les polices **Abril Fatface** (titres) et **Nunito** (corps).

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| **Frontend** | React | 19 |
| **Routing frontend** | Wouter | 3.x |
| **Styling** | Tailwind CSS | 4 |
| **Composants UI** | shadcn/ui + Radix UI | — |
| **API layer** | tRPC | 11 |
| **Backend** | Express | 4 |
| **ORM** | Drizzle ORM | 0.44 |
| **Base de données** | MySQL / TiDB | — |
| **Auth** | Manus OAuth (Google, Microsoft, Apple, email) | — |
| **Runtime** | Node.js | 22+ |
| **Package manager** | pnpm | 10 |
| **Tests** | Vitest | 2 |
| **TypeScript** | TypeScript | 5.9 |

---

## Arborescence du projet

```
claudine/
│
├── client/                          # Application React (frontend)
│   ├── index.html                   # Point d'entrée HTML (fonts Google, meta)
│   ├── public/                      # Assets statiques publics (favicon, robots.txt)
│   └── src/
│       ├── main.tsx                 # Bootstrap React + tRPC + QueryClient
│       ├── App.tsx                  # Router principal (wouter) + ThemeProvider
│       ├── index.css                # Thème global CLAUDINE (variables CSS, classes utilitaires)
│       ├── const.ts                 # Constantes frontend (getLoginUrl, APP_ID)
│       │
│       ├── _core/                   # Hooks et utilitaires injectés par le framework
│       │   └── hooks/
│       │       └── useAuth.ts       # Hook d'authentification (user, isAuthenticated, logout)
│       │
│       ├── components/              # Composants réutilisables
│       │   ├── ClaudineNav.tsx      # Navbar principale (auth state, badge messages)
│       │   ├── AIChatBox.tsx        # Composant chat IA générique (template)
│       │   ├── DashboardLayout.tsx  # Layout dashboard avec sidebar (template)
│       │   ├── ErrorBoundary.tsx    # Gestion des erreurs React
│       │   ├── ManusDialog.tsx      # Dialog générique (template)
│       │   ├── Map.tsx              # Intégration Google Maps (template)
│       │   └── ui/                  # Composants shadcn/ui (Button, Card, Input, etc.)
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── input.tsx
│       │       ├── dialog.tsx
│       │       ├── sonner.tsx       # Notifications toast
│       │       └── ...              # (30+ composants Radix/shadcn)
│       │
│       ├── contexts/
│       │   └── ThemeContext.tsx     # Contexte dark/light mode
│       │
│       ├── hooks/
│       │   ├── useComposition.ts   # Hook composition IME
│       │   ├── useMobile.tsx       # Détection mobile
│       │   └── usePersistFn.ts     # Stabilisation de références de fonctions
│       │
│       ├── lib/
│       │   ├── trpc.ts             # Client tRPC (createTRPCReact)
│       │   └── utils.ts            # Utilitaires (cn, clsx)
│       │
│       └── pages/                  # Pages de l'application
│           ├── Landing.tsx         # Page d'accueil (hero bordeaux, ticker, CTA)
│           ├── Profils.tsx         # Découvrir les profils (recherche, cartes, Contacter)
│           ├── MonProfil.tsx       # Mon profil (formulaire persistant en DB)
│           ├── Chat.tsx            # Messagerie (liste conversations + thread, polling 2s)
│           ├── Inscription.tsx     # Page inscription (OAuth)
│           ├── Connexion.tsx       # Page connexion (OAuth)
│           ├── Home.tsx            # Redirect vers Landing (compatibilité)
│           ├── NotFound.tsx        # Page 404
│           └── ComponentShowcase.tsx # Vitrine composants (dev only)
│
├── server/                          # Backend Express + tRPC
│   ├── routers.ts                   # ⭐ Routeur tRPC principal (auth, profile, chat)
│   ├── db.ts                        # ⭐ Helpers de requêtes DB (profiles, messages, convos)
│   ├── storage.ts                   # Helpers S3 (storagePut, storageGet)
│   ├── index.ts                     # Point d'entrée serveur (re-export)
│   ├── auth.logout.test.ts          # Tests Vitest (auth logout)
│   └── _core/                       # Infrastructure framework (ne pas modifier)
│       ├── index.ts                 # Bootstrap Express + Vite SSR
│       ├── context.ts               # Contexte tRPC (user depuis JWT)
│       ├── trpc.ts                  # Factories publicProcedure / protectedProcedure
│       ├── oauth.ts                 # Flux OAuth (callback, state, JWT)
│       ├── cookies.ts               # Options cookies sécurisés
│       ├── env.ts                   # Variables d'environnement typées
│       ├── systemRouter.ts          # Routes système (notifyOwner)
│       ├── vite.ts                  # Middleware Vite dev/prod
│       ├── llm.ts                   # Helper LLM (invokeLLM)
│       ├── imageGeneration.ts       # Helper génération d'images
│       ├── voiceTranscription.ts    # Helper transcription audio
│       ├── map.ts                   # Helper Google Maps (backend)
│       ├── notification.ts          # Helper notifications owner
│       ├── dataApi.ts               # Helper Data API Manus
│       ├── sdk.ts                   # SDK Manus
│       └── types/                   # Types TypeScript internes
│           ├── cookie.d.ts
│           └── manusTypes.ts
│
├── drizzle/                         # ORM et migrations
│   ├── schema.ts                    # ⭐ Schéma DB (users, profiles, conversations, messages)
│   ├── relations.ts                 # Relations Drizzle
│   ├── 0000_charming_whiplash.sql   # Migration initiale (users)
│   ├── 0001_lean_silverclaw.sql     # Migration CLAUDINE (profiles, conversations, messages)
│   └── meta/                        # Métadonnées Drizzle Kit
│       ├── _journal.json
│       ├── 0000_snapshot.json
│       └── 0001_snapshot.json
│
├── shared/                          # Code partagé frontend ↔ backend
│   ├── const.ts                     # Constantes partagées (COOKIE_NAME, messages d'erreur)
│   ├── types.ts                     # Types partagés
│   └── _core/
│       └── errors.ts                # Codes d'erreur standardisés
│
├── patches/
│   └── wouter@3.7.1.patch           # Patch pnpm pour wouter
│
├── .gitignore
├── .prettierrc
├── .prettierignore
├── components.json                  # Config shadcn/ui
├── drizzle.config.ts                # Config Drizzle Kit
├── package.json                     # Dépendances et scripts
├── pnpm-lock.yaml                   # Lockfile pnpm
├── tsconfig.json                    # Config TypeScript (projet)
├── tsconfig.node.json               # Config TypeScript (Node/serveur)
├── vite.config.ts                   # Config Vite (SSR + plugins)
├── vitest.config.ts                 # Config Vitest
├── todo.md                          # Suivi des fonctionnalités
└── README.md                        # Ce fichier
```

---

## Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** ≥ 22 — [nodejs.org](https://nodejs.org)
- **pnpm** ≥ 10 — `npm install -g pnpm`
- **MySQL** ≥ 8 ou **TiDB** (ou une instance cloud compatible MySQL)

---

## Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/Y4bok/claudine-site.git
cd claudine-site

# 2. Installer les dépendances
pnpm install

# 3. Copier et remplir les variables d'environnement
cp .env.example .env
# → Éditer .env avec tes valeurs (voir section ci-dessous)

# 4. Pousser le schéma en base de données
pnpm db:push

# 5. Lancer le serveur de développement
pnpm dev
```

Le serveur démarre sur **http://localhost:3000**.

---

## Variables d'environnement

Crée un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# ── Base de données ──────────────────────────────────────────────────────────
DATABASE_URL=mysql://user:password@localhost:3306/claudine

# ── Authentification ─────────────────────────────────────────────────────────
# Ces variables sont fournies par la plateforme Manus en production.
# En local, tu peux utiliser ton propre serveur OAuth ou un mock.
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=your-open-id
OWNER_NAME=your-name

# ── APIs Manus (optionnel en local) ──────────────────────────────────────────
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# ── Analytics (optionnel) ────────────────────────────────────────────────────
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

> **Note :** En production sur la plateforme Manus, toutes ces variables sont injectées automatiquement. Aucune configuration manuelle n'est nécessaire.

---

## Base de données

Le projet utilise **Drizzle ORM** avec MySQL. Les 4 tables principales sont :

| Table | Description |
|---|---|
| `users` | Comptes utilisateurs (créés via OAuth) |
| `profiles` | Profils CLAUDINE (enseigne, ville, réduction, enseignes recherchées) |
| `conversations` | Conversations entre deux utilisateurs |
| `messages` | Messages d'une conversation |

```bash
# Générer et appliquer les migrations
pnpm db:push

# Inspecter le schéma
cat drizzle/schema.ts
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance le serveur de développement (Express + Vite HMR) |
| `pnpm build` | Build de production (frontend + backend bundlé) |
| `pnpm start` | Lance le serveur de production (après build) |
| `pnpm test` | Lance les tests Vitest |
| `pnpm db:push` | Génère et applique les migrations Drizzle |
| `pnpm check` | Vérifie les types TypeScript sans compiler |
| `pnpm format` | Formate le code avec Prettier |

---

## Architecture

```
Browser
  │
  ├── React 19 (Vite)
  │     ├── wouter (routing)
  │     ├── tRPC client (httpBatchLink)
  │     └── @tanstack/react-query (cache)
  │
  ↕ HTTP /api/trpc (JSON-RPC batch)
  │
  ├── Express 4
  │     ├── /api/oauth/callback  → Manus OAuth flow
  │     ├── /api/trpc            → tRPC handler
  │     └── /*                   → Vite SSR (dev) / static (prod)
  │
  ├── tRPC Routers
  │     ├── auth.me / auth.logout
  │     ├── profile.me / profile.save / profile.list
  │     └── chat.myConversations / chat.messages / chat.send / chat.unreadCount
  │
  └── Drizzle ORM → MySQL
        ├── users
        ├── profiles
        ├── conversations
        └── messages
```

---

## Fonctionnalités

### Authentification
L'authentification est gérée par **Manus OAuth**, qui supporte nativement Google, Microsoft, Apple et email/password. Le flux est le suivant : le frontend redirige vers le portail OAuth Manus, qui renvoie un token JWT stocké dans un cookie `HttpOnly`. Chaque requête tRPC protégée vérifie ce cookie via `protectedProcedure`.

### Profils
Chaque utilisateur peut créer un profil avec son prénom/pseudo, son enseigne, sa ville, son taux de réduction employé et la liste des enseignes qu'il recherche. Les profils sont stockés en DB et visibles par tous les membres connectés.

### Chat
Le chat fonctionne par **polling toutes les 2 secondes** via tRPC. Chaque conversation est une paire d'utilisateurs. Les messages sont stockés en DB avec horodatage UTC. Un badge dans la navbar indique le nombre de messages non lus.

### Matching (à venir)
La logique de matching avancée (badge "✦ Match !" quand les enseignes correspondent mutuellement) est planifiée comme prochaine fonctionnalité.

---

## Tests

```bash
pnpm test
```

Les tests utilisent **Vitest**. Le test de référence (`server/auth.logout.test.ts`) vérifie que la mutation `auth.logout` efface correctement le cookie de session.

Pour ajouter des tests :

```typescript
// server/feature.test.ts
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("feature", () => {
  it("should work", async () => {
    // ...
  });
});
```

---

## Déploiement

### Sur la plateforme Manus (recommandé)
1. Créer un checkpoint dans l'interface Manus
2. Cliquer sur **Publish** — toutes les variables d'environnement sont injectées automatiquement

### Sur un serveur externe (VPS, Railway, Render, etc.)
```bash
# Build
pnpm build

# Lancer en production
NODE_ENV=production node dist/index.js
```

Assure-toi de définir toutes les variables d'environnement listées dans la section [Variables d'environnement](#variables-denvironnement).

---

## Contribuer

1. Fork le dépôt
2. Crée une branche feature : `git checkout -b feature/mon-ajout`
3. Commit tes changements : `git commit -m "feat: description"`
4. Push : `git push origin feature/mon-ajout`
5. Ouvre une Pull Request

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
