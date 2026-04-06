# CLAUDE.md

## Project overview

- Stack: Next.js 16 App Router, Supabase, Tailwind CSS v4, shadcn/ui
- Package manager: use `bun` only
- Rich text content is stored as Tiptap JSON

## Setup

- `bun dev` / `bun build` / `bun start` / `bun lint`
- Add shadcn/ui components: `bunx shadcn add <name>`
- `.env.local` must include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Architecture

- App Router with Supabase for DB, Auth, and Storage
- `AuthProvider` wraps the app and exposes `useAuth()` with `user`, `profile`, `isAdmin`, `isLoading`, `signIn`, `signOut`
- `NuqsAdapter` is wired in the root layout for URL search param state
- Root layout loads pinned events for `<Header pinnedEvents={...} />`

## Maintenance

- Sibling MCP repo 在 `~/mcp.ai.winlab.tw`，變更 schema / RLS / admin workflow 後需同步檢查

## Delivery workflow

- 每個完成的實作主題視為獨立 commit，驗證通過後即可 commit
- Push 前執行 local verification commands
- 整體目標完成後，等使用者確認再 push
