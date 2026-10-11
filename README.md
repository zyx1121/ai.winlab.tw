<div align="center">

<h1>NYCU AI Office</h1>

<p><strong>The website of the NYCU Office of AI Affairs, edited by the people who run its events.</strong></p>

[![CI](https://img.shields.io/github/actions/workflow/status/zyx1121/ai.winlab.tw/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/zyx1121/ai.winlab.tw/actions)
[![Live](https://img.shields.io/badge/live-ai.winlab.tw-000000?style=flat-square)](https://ai.winlab.tw)
[![License](https://img.shields.io/github/license/zyx1121/ai.winlab.tw?style=flat-square)](LICENSE.md)

**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

</div>

![NYCU AI Office social card](public/og.png)

The office runs events, recruitment drives and result reports, and each one needs a page on the day that someone decides it. Every content type has its own editor in the browser, so the person who runs an event publishes it directly.

## Features

- **Publishes content**: announcements, event pages, results and recruitment listings, per event or global.
- **Edits in place**: a Tiptap editor with images, YouTube embeds and auto-save on every content type.
- **Gates by role**: admins read and write everything, vendors manage recruitment for their events, and everyone else sees published content.
- **Tracks participation**: event participants and result co-authors, with pinned events and results on the home page.

## Quick start

```sh
git clone https://github.com/zyx1121/ai.winlab.tw && cd ai.winlab.tw
bun install
printf 'NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=\n' > .env.local   # fill in your Supabase keys
bun dev
```

Open http://localhost:3000. You should see the home page with the carousel and the latest announcements.

## Usage

| Role | Sees and does |
|------|---------------|
| Signed out | published content only |
| Signed in | own drafts and everything published |
| Admin | full read and write on every table |
| Vendor | recruitment listings under assigned events |

- Each content page has an `/edit` page for the roles that can write it.
- Apply the 32 SQL migrations in `supabase/migrations/` in order in the Supabase SQL editor. Every table has row-level security.
- Uploaded images go to the public `announcement-images` storage bucket.

## Configuration

| Key | Sets |
|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | the Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | the Supabase publishable key |

## How it works

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Backend | Supabase (Postgres with RLS, Storage) |
| Styling | Tailwind CSS 4 and shadcn/ui |
| Editor | Tiptap, with content stored as JSON |

Vercel builds and hosts the site at [ai.winlab.tw](https://ai.winlab.tw). Row-level security in Postgres enforces the roles, so the browser never decides access.

## For AI agents

Facts for coding agents and LLM tools. The rules for changing the code are in [AGENTS.md](AGENTS.md).

- **Summary**: Next.js and Supabase website for the NYCU Office of AI Affairs, with role-gated Tiptap editors for every content type.
- **Type**: web
- **Interfaces**: HTTP, the site at https://ai.winlab.tw. A separate MCP server lives in the `mcp.ai.winlab.tw` repo.
- **Install**: `bun install`
- **Run**: `bun dev`
- **Verify**: `bun run check` (tests and typecheck)
- **Config**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **Secrets**: none in the repo. The publishable key is public, and RLS protects the data.
- **Limits**: an admin applies migrations by hand in the SQL editor.

## Development

```sh
bun install
bun run check
```

CI runs `bun test` and `tsc --noEmit` on every push and pull request.

## License

[MIT](LICENSE.md)
