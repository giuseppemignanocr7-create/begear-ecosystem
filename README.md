# Ecosystem Ω · BeGear Edition

Demo enterprise per BeGear S.r.l., verticalizzata sulla filiera formazione, selezione, placement, staffing e Academy-as-a-Service.

## Avvio locale

1. Installa le dipendenze con `pnpm install`.
2. Avvia Supabase locale con `pnpm supabase:start`.
3. Applica schema e seed P1 con `pnpm supabase:reset`.
4. Copia `.env.example` in `.env.local` e inserisci le chiavi mostrate da `pnpm supabase:status`.
5. Avvia Next.js con `pnpm dev`.

## Script principali

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm ci`
- `pnpm supabase:reset`

## Database P1

- Migrazione: `supabase/migrations/20260614130000_p1_foundation.sql`
- Seed accessi e RBAC: `supabase/seed/01_tenant_access.sql`
- Seed operativo BeGear: `supabase/seed/02_operational_data.sql`
- Tipi runtime: `types/database.ts`
- Query layer: `lib/db/foundation.ts`

## Stack

- Next.js 15 App Router
- React 19
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- Supabase PostgreSQL locale
