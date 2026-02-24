# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev       # Start development server
bun build     # Build for production
bun start     # Start production server
bun lint      # Run ESLint
```

This project uses **bun** as the package manager (not npm/yarn/pnpm).

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## Architecture

This is a **Next.js 16 (App Router)** website for the NYCU (國立陽明交通大學) AI Office. It uses **Supabase** as the backend (database + auth + storage) and **Tailwind CSS v4** with **shadcn/ui** components.

### Data Model (`lib/supabase/types.ts`)

Key entities:
- **Announcement** — news posts with Tiptap rich-text content (JSON), `status: draft|published`
- **Introduction** — single-record office introduction page with Tiptap content
- **Result** — competition results, `type: personal|team`, linked to optional `team_id`
- **Recruitment** — job postings with image and external link (DB table: `competitions`)
- **OrganizationMember** — staff/members with `category: ai_newcomer|industry_academy|alumni`
- **Profile** — extends `auth.users`; `role: admin|user`
- **Team / TeamMember / TeamInvitation** — team management for competition results

### Auth & Authorization (`components/auth-provider.tsx`)

`AuthProvider` wraps the app (in `app/layout.tsx`) and exposes `useAuth()` which provides:
- `user`, `profile`, `isAdmin`, `isLoading`
- `signIn`, `signOut`, `refreshProfile`

**Authorization pattern:** logged-in users see all records (including drafts); anonymous users see only `status: published` records. Admin-only actions are guarded by `isAdmin` (derived from `profile.role === 'admin'`).

### Supabase Client Usage

- **Client Components**: `import { createClient } from "@/lib/supabase/client"` (browser client)
- **Server Components / Route Handlers**: `import { createClient } from "@/lib/supabase/server"` (async, reads cookies)
- **Middleware**: `import { createClient } from "@/lib/supabase/proxy"` (for Next.js middleware)

### Rich Text Editing (`components/tiptap-editor.tsx`)

`TiptapEditor` is a shared component used for Announcement and Result content. Content is stored as Tiptap JSON (`Record<string, unknown>`) in Supabase. Supports drag-and-drop/paste image upload (calls `uploadAnnouncementImage` from `lib/upload-image.ts`).

### Image Uploads (`lib/upload-image.ts`)

All images go to the `announcement-images` Supabase Storage bucket (public). Paths are prefixed by content type:
- Announcement inline images: root-level
- Recruitment cards: `recruitment/`
- Result header images: `results/`
- Organization member photos: `organization/`

**One-time Supabase setup required:** create the `announcement-images` bucket (public) and run `supabase/storage-policies.sql`.

### Page Structure

**Public pages** (home sections rendered as server components, each fetches its own data):
- `/` — home page composed of `HomeCarousel`, `HomeIntroduction`, `HomeOrganization`, `HomeAnnouncement`, `HomeResult`, `HomeRecruitment`, `HomeContacts`

**Content management pages** (all client components, require login):
- `/announcement` — list; `/announcement/[id]` — read-only view; `/announcement/[id]/edit` — editor
- `/result` — list; `/result/[id]` — read-only view; `/result/[id]/edit` — editor
- `/recruitment` — list with edit-in-place (DB table: `competitions`)
- `/introduction` — read-only; `/introduction/edit` — editor
- `/organization` — member grid by category; `/organization/[id]/edit` — member editor

**Account pages** (require login):
- `/account` — profile + team membership + pending invitations
- `/account/teams` — team list/create
- `/account/teams/[id]` — team detail + invite members

### Database Migrations

SQL migrations are in `supabase/migrations/`. Apply them in order in the Supabase SQL editor. RLS is enabled on all tables — unauthenticated users can only read published content; authenticated users have broader access; admins have full write access.

### UI Components

Uses **shadcn/ui** (`components/ui/`). Add new components via:
```bash
bunx shadcn add <component-name>
```

Fonts: **Noto Sans** + **Noto Sans Mono** (Google Fonts, via `next/font`).
