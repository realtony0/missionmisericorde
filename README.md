# Mission Miséricorde - Site officiel

Site officiel de l'association Mission Miséricorde (sadaqa jariya au Sénégal): réalisations, suivi dynamique des travaux, dons, contact et interface d'administration.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Prisma** + **PostgreSQL (Neon)**
- **NextAuth.js** (authentification admin)
- **Framer Motion**
- **Leaflet** (carte des réalisations)
- **Cloudinary** (upload images/vidéos depuis l'admin)

## Prérequis

- Node.js 18+
- npm
- Base PostgreSQL (Neon recommandé)

## Installation

```bash
cd mission-misericorde
npm install
cp .env.example .env
```

## Configuration `.env`

Variables principales:

- `DATABASE_URL` : URL PostgreSQL (Neon)
- `DIRECT_URL` : URL directe PostgreSQL (migrations Prisma)
- `NEXTAUTH_SECRET` : générer avec `openssl rand -base64 32`
- `NEXTAUTH_URL` : URL locale/prod du site
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Base de données

```bash
npm run db:push
npm run db:seed
```

Le seed initialise:

- 28 réalisations (puits + mini-forage)
- paramètres site (WhatsApp, contact, réseaux sociaux, dons)
- compte admin par défaut

Compte admin seedé (à changer en production):

- Email: `admin@mission-misericorde.org`
- Mot de passe: `admin123`

## Lancer le projet

```bash
npm run dev
```

- Site public: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Fonctionnalités implémentées

- Menu complet: Accueil, Nos actions, Réalisations, Travaux en cours, Faire un don, À propos, Rejoindre nos groupes, Contact.
- Réalisations avec filtres par catégorie, carte, galeries photos, vidéos, date de réalisation.
- Travaux en cours dynamiques:
  - métadonnées projet (numéro, catégorie, localisation, date de début, objectif financier, progression, statut)
  - historique d'étapes (date, description, photos, vidéos)
  - vidéo d'inauguration
  - archivage automatique dans Réalisations quand le statut passe à `Terminé`
- Dons:
  - cagnottes + dons libres
  - affectation optionnelle d'un don à un projet
  - progression financière
  - moyens de paiement + message de sécurisation administrables
- Contact:
  - email, WhatsApp, formulaire
  - liens réseaux sociaux administrables
- Admin:
  - login sécurisé (NextAuth credentials)
  - CRUD réalisations, travaux, cagnottes
  - paramètres WhatsApp / contact / réseaux / dons
  - upload Cloudinary depuis les formulaires admin

## Déploiement (Vercel + Neon)

1. Connecter le repo à Vercel.
2. Définir les variables d'environnement (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_*`, `CLOUDINARY_*`).
3. Exécuter Prisma au déploiement:
   - `prisma generate` (déjà lancé via `postinstall`)
   - `prisma db push` ou `prisma migrate deploy`
4. Seed initial (une fois):
   - `npm run db:seed`

## Structure des pages

| Page | Route |
|---|---|
| Accueil | `/` |
| Nos actions | `/nos-actions` |
| Réalisations | `/realisations` |
| Travaux en cours | `/travaux-en-cours` |
| Faire un don | `/faire-un-don` |
| À propos | `/a-propos` |
| Rejoindre nos groupes | `/rejoindre` |
| Contact | `/contact` |
| Admin | `/admin` |

## Licence

Projet privé - Mission Miséricorde.
