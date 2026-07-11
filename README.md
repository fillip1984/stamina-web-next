# Todo App

Personal, invitation-only task tracking application focused on recurring behavior change.

This project is built with Next.js, tRPC, TanStack Query, Drizzle ORM, Better Auth, and a shadcn/Base UI component stack.

## Project Documentation

Core project docs now live in three files at the repo root:

- [DESIGN.md](DESIGN.md): Product vision, UX architecture, domain model, system architecture, and current design gaps.
- [SPEC.md](SPEC.md): Functional and non-functional requirements, acceptance criteria, API/data constraints, and release criteria.
- [TASKS.md](TASKS.md): Prioritized implementation backlog with milestones, definitions of done, and risk tracking.

## How To Use The Docs

- Start with [DESIGN.md](DESIGN.md) to understand why the product is shaped this way.
- Use [SPEC.md](SPEC.md) as the source of truth for behavior and acceptance criteria.
- Execute work from [TASKS.md](TASKS.md) in milestone order.

Recommended workflow for a change:

1. Confirm the requirement in [SPEC.md](SPEC.md).
2. Validate UX and architectural fit with [DESIGN.md](DESIGN.md).
3. Pick or create a task in [TASKS.md](TASKS.md).
4. Implement, test, and update docs if behavior changes.

## Current Product Scope

- Authenticated single-user experience.
- Collections CRUD.
- Task CRUD with typed behavior (Todo, Countdown, Seeking, Tally).
- Task completion with optional measurement side effects.
- Data export from Settings.

## Known Gaps (Tracked)

- Completion side-effect UI integration is partial.
- Some task card actions are stubbed/partially wired.
- Collection type settings are not fully persisted.
- Import flow is not yet implemented.

See [TASKS.md](TASKS.md) for the prioritized implementation plan.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Open http://localhost:3000.

## Scripts

- `pnpm dev` - Start development server.
- `pnpm build` - Lint, typecheck, and build production bundle.
- `pnpm start` - Run production server.
- `pnpm lint` - Run ESLint.
- `pnpm typecheck` - Run TypeScript checks.
- `pnpm format` - Format TypeScript files.
- `pnpm db:push` - Push Drizzle schema to database.
- `pnpm db:studio` - Open Drizzle Studio.

## Tech Stack

- Next.js (App Router)
- React
- tRPC + TanStack Query
- Drizzle ORM + Postgres
- Better Auth (Google OAuth)
- Tailwind CSS + shadcn/Base UI
