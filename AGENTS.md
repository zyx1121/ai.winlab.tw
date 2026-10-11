# ai.winlab.tw

Website of the NYCU Office of AI Affairs: Next.js 16 App Router, Supabase, Tailwind CSS 4 and shadcn/ui, with rich text stored as Tiptap JSON. Read [README.md](README.md) first.

## Setup

- `bun dev`, `bun run build`, `bun start`, `bun run lint`, `bun run check`
- `bunx shadcn add <name>` adds a component.
- `.env.local` needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- After a change to the schema, RLS or an admin workflow, update the sibling MCP repo `mcp.ai.winlab.tw` to match.

## Architecture

- `AuthProvider` wraps the app. `useAuth()` returns `user`, `profile`, `isAdmin`, `isLoading`, `signIn` and `signOut`.
- `NuqsAdapter` in the root layout keeps state in URL search params.
- The root layout loads the pinned events for `<Header pinnedEvents={...} />`.
- Client components import Supabase from `@/lib/supabase/client`. Server components and route handlers import it from `@/lib/supabase/server`.

## Access

- Signed out: `status: published` only.
- Signed in, not admin: own drafts and everything published.
- Admin (`profile.role === 'admin'`): full read and write.
- Vendor: recruitment create, read, update and delete under assigned events (`event_vendors` and `created_by = auth.uid()`). `isEventVendor()` is in `lib/supabase/check-event-vendor.ts`.
- Server components read `isAdmin` from the `profiles` table.

## Data model (`lib/supabase/types.ts`)

- **Announcement**: Tiptap JSON, `status: draft|published`, `event_id` (null means global).
- **Result**: `type: personal|team`, `pinned`, `event_id`.
- **Recruitment** (table `competitions`): `event_id`, and JSON `positions`, `application_method`, `contact`, plus `created_by`.
- **EventVendor** (table `event_vendors`): vendor to event.
- **RecruitmentInterest** (table `recruitment_interests`).
- **Event**: `slug`, `status`, `pinned`, `sort_order`.
- **Introduction**: one row, Tiptap JSON.
- **OrganizationMember**: `category: core|legal_entity|industry`.
- **Profile**: `role: admin|user|vendor`, profile fields, social links and resume.
- **ExternalResult**, **Tag** and **ResultTag**, **Team**, **CarouselSlide**, **Contact**.

Only announcements can be global (`event_id IS NULL`). Recruitment is always event-scoped. Results have no global list. Their detail page is `/events/[slug]/results/[id]`.

## Database and storage

- Migrations live in `supabase/migrations/`. Apply them in order in the SQL editor. Every table has RLS.
- Images go to the public `announcement-images` bucket, under the root (announcements), `recruitment/`, `results/`, `organization/` and `events/`. Its policies live in the dashboard.

## Pages

- Home `/`: `HomeCarousel`, `HomeIntroduction`, `HomeAnnouncement`, `HomeEvents`, `HomeContacts`.
- Events: `/events`, then `/events/[slug]` with announcement, result and recruitment tabs, and `[slug]/edit`, `announcements/[id]`, `results/[id]`, `recruitment/[id]`.
- Content: `/announcement`, `/introduction`, `/organization`, `/carousel`, `/contacts`, `/privacy`, each with `/edit`.
- Account: `/account`, and `/profile/[id]`, where vendors see My Events.
- Admin: `/settings`, `/settings/users`.

## Hooks

Hooks own state and logic. Components only render.

- `useAutoSave`: debounced save and a navigation guard.
- `useContentEditor`: generic editor state, save, publish and delete, with `useAutoSave` built in.
- `useImageUpload`: one image upload with a file ref and a loading state.
- `useCrudList`: admin lists with fetch, create and delete. `initialItems` skips the fetch on mount.
- `useDialogForm`: create, update and delete through a dialog form.
- `useProfileEditor`: profile fields, links and external results.
- `useEventActions`: create content and toggle pins on an event page.

Every hook keeps the Supabase client in `useRef(createClient())`, and keeps callback props such as `uploadFn` and `onBeforeSave` in refs. Every failed write shows `toast.error`. Edit pages take `initialData` from the server page and never fetch on the client.

## UI rules

- Radius: `rounded-sm` and `rounded-md` are 1rem inside, `rounded-lg` and up are 2rem outside, `--radius: 2rem`.
- Motion: `duration-200` only, with `hover:scale-[1.02]` and `active:scale-[0.98]`, or `.interactive-scale`.
- Spacing: home `py-16`, content `py-12`, admin `py-8`, through the `PageSection` and `PageShell` variants.
- Links: always `AppLink`, never a raw `<a>`.
- Skeletons: each high-level component owns its skeleton. Route loading files compose them.
- Editor: on desktop, `BubbleMenu` (inline) and `FloatingMenu` (blocks, with `/` insertion) instead of a fixed toolbar. On mobile, a compact toolbar.
- Status: the `Badge` component, `variant="default"` for published and `variant="secondary"` for drafts.
- Empty states: centered `尚無{entity}` in `text-muted-foreground`.
- Color: semantic tokens such as `text-foreground` and `bg-background`. Never hard-code `gray-*`.
- Packages: shadcn/ui in `components/ui/`, Tailwind 4 in `app/globals.css` (no `tailwind.config.js`), `next-themes` with `defaultTheme="light"`.
- Fonts: `--font-noto-sans` for the interface, `--font-noto-sans-mono` for code, `--font-instrument-serif` for decoration (inline style only).
- `card.tsx` is a plain div server component. Use `data-slot` for CSS selectors. `next/image` allows `*.supabase.co`.

## Where to run things and verify

In Loki's environment, run `bun install`, `bun run check` and the dev server on `ssh sandbox` in a login shell (`bash -lc`). Commit each change on its own after it passes, and wait for the user before you push.

```sh
bun install
bun run check   # bun test and tsc --noEmit
```
