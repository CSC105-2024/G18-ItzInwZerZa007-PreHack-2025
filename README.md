# G18 - iMood

## Project Structure

This project is divided into two main parts: **frontend** and **backend**. Each part has its own dependencies and setup instructions.

- `frontend/`: iMood web application (Next.js + Tailwind)
- `backend/`: API and database logic (Hono + Prisma)

---

## Installation

### Enable Corepack

Ensure you have **Node.js v16+** and enable Corepack to manage package managers like `pnpm`:

```sh
corepack enable
corepack use pnpm@latest
```

### Install Dependencies

```sh
pnpm install
```

---

## Running the Project

### Run Both Frontend & Backend

```sh
pnpm --filter frontend run dev & pnpm --filter backend run dev
```

---

### Run Frontend Only

```sh
pnpm --filter frontend run dev
```

### Run Backend Only

```sh
pnpm --filter backend run dev
```

---

## How to Set Up the Backend (Simplified Explanation)

In our project, we use `pnpm` as the package manager.

After running:

```sh
pnpm install
```

You don’t need to do anything else for the **frontend** — it's ready to go.

But for the **backend**, here are the steps:

1. First, generate an environment file by copying the example:
   ```bash
   cp .env.example .env
   ```

2. Then, open the new `.env` file and set your database variables:
   - `DATABASE_URL`
   - `SHADOW_DATABASE_URL`

3. Next, run this command to initialize Prisma:
   ```bash
   pnpm run prisma:init
   ```
   > You can find this script in the `backend/package.json` file.

4. At this point, the project is almost ready.  
   However, the server still has no mood data — so run:
   ```bash
   pnpm run prisma:seed
   ```
   This will add the default moods into the database.

5. *(Optional)* If you want to simulate a user who already has mood data, run:
   ```bash
   pnpm run prisma:simulate
   ```

   That’s it — you're ready to start working on the project!

---