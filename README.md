# Campus Loop

Next.js 14 + Prisma + PostgreSQL starter for a university tech/AI social network.

## Features (MVP)
- Email/password auth (NextAuth Credentials + bcrypt)
- Post feed, post detail, comments, like toggle
- Events list/detail + Add to Calendar (.ics)
- Ownership-based delete for posts/events
- Seeded demo data

## Tech
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma ORM
- PostgreSQL (Docker)
- Zod validation (basic)

## Getting Started

### 1) Environment
Copy and edit the env file:

```bash
cp .env.example .env
```

Make sure `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` are set.

### 2) Database
Start Postgres:

```bash
docker compose up -d
```

### 3) Install dependencies

```bash
npm install
```

### 4) Migrate + Seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Accounts
- `alize@st.biruni.edu.tr` / `password123`
- `ayca@st.biruni.edu.tr` / `password123`

## Routes
- `/` Home feed
- `/posts` Posts list
- `/posts/[id]` Post detail
- `/posts/new` Create post (auth)
- `/events` Events list
- `/events/[id]` Event detail
- `/events/new` Create event (auth)
- `/events/[id]/calendar` Download `.ics`
- `/login` / `/register`

## Repository
- GitHub: https://github.com/AycaSudem/web-final-project.git

## TODO (Intentional)
- Input validation rules + sanitization
- Pagination, search, and filtering
- Edit flows for posts/events
- Moderation / admin tools
- RSVP + calendar sync


