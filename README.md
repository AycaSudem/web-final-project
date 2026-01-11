# Campus Loop Backend

Backend API + Prisma for the Campus Loop project.

## Tech
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Docker)

## Setup

### 1) Environment
Copy and edit the env file:

```bash
cp .env.example .env
```

Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

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

## Repository
- GitHub: https://github.com/AycaSudem/web-final-project.git
