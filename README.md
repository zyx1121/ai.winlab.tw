![NYCU AI Office](public/og.png)

<sub>Social preview card served at ai.winlab.tw.</sub>

# NYCU AI Office

> Announcements, events, results, and recruitment for NYCU's AI Office, kept current by whoever is running the event, not whoever last touched the code.

`nextjs` · `supabase` · `tailwindcss` · `typescript`

[![CI](https://github.com/zyx1121/ai.winlab.tw/actions/workflows/ci.yml/badge.svg)](https://github.com/zyx1121/ai.winlab.tw/actions) &nbsp;[![Live](https://img.shields.io/badge/live-ai.winlab.tw-111111)](https://ai.winlab.tw) &nbsp;[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](#license)

The Office of AI Affairs runs events, hosts recruitment drives, and reports results, and each one needs a page the same day it's decided. This site gives every content type (announcements, results, recruitment, org roster, homepage carousel) its own in-browser Tiptap editor, gated by role, so whoever is running the event publishes it directly instead of filing a ticket with a developer.

## Quickstart

```bash
git clone https://github.com/zyx1121/ai.winlab.tw && cd ai.winlab.tw
bun install
```

Create `.env.local` with your Supabase project's keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

```bash
bun dev
```

## What it gives you

- **Publishes** announcements, event pages, results, and recruitment listings, each scoped to an event or kept global
- **Edits inline** with a Tiptap rich text editor: images, YouTube embeds, and auto-save on every content type
- **Gates by role**: admins get full read/write, vendors manage recruitment for their assigned events, everyone else sees published content only
- **Tracks participation**: event participants and result co-authors, with pinned events and results surfaced on the homepage

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Backend | Supabase (Postgres + RLS + Storage) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Package manager | Bun |

## Roles & access

| Role | Sees |
|------|------|
| Anonymous | published content only |
| Signed-in user | own drafts + everything published |
| Admin | full read/write across every table |
| Vendor | recruitment CRUD scoped to their assigned events |

## Database

32 SQL migrations live under `supabase/migrations/`, applied in order via the SQL editor; every table ships with RLS. Uploaded images land in the public `announcement-images` storage bucket.

## Deploy

Live at [ai.winlab.tw](https://ai.winlab.tw), built and hosted on Vercel. CI (`.github/workflows/ci.yml`) runs `bun test` and `tsc --noEmit` on every push and pull request.

## Contributing

Issues and PRs welcome: start with [CONTRIBUTING.md](https://github.com/zyx1121/.github/blob/main/CONTRIBUTING.md).

## License

[MIT](LICENSE.md) · AI for all.
