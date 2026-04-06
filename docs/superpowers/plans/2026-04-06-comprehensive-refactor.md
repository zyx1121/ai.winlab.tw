# Comprehensive Refactor Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full consistency pass — hooks extraction, UI pattern unification, error handling standardization, SEO fixes, performance improvements. Every similar feature should look, behave, and fail the same way.

**Architecture:** 6 phases, each independently mergeable. Phase 1 unblocks Phase 2. Others are parallel.

**Tech Stack:** Next.js 16 App Router, Supabase, Tailwind CSS v4, shadcn/ui, Tiptap

---

## Audit Sources

This plan consolidates findings from 8 review agents:
- Hooks API design review + codebase fit review
- UI pattern inconsistency audit
- Data type & business logic audit
- Error handling & UX feedback audit
- SEO & metadata audit
- Accessibility & responsive audit
- Performance audit

---

## Phase 1: Server-Fetch Migration

**Why first:** 5 edit pages do client-side fetch in useEffect. This blocks `useContentEditor` (which requires `initialData` at init) and hurts performance (waterfall, extra loading spinner).

**Pattern to follow:** `app/announcement/[id]/edit/page.tsx` — server component fetches data, passes as prop to client component.

### Task 1.1: Migrate `contacts/[id]/edit`

- [ ] `app/contacts/[id]/edit/page.tsx` — add server-side fetch, pass `initialContact` prop
- [ ] `app/contacts/[id]/edit/client.tsx` — accept `id` + `initialContact` props, remove useEffect fetch + loading state
- [ ] Verify: `bun run check`
- [ ] Commit: `refactor: server-fetch contacts edit page`

### Task 1.2: Migrate `carousel/[id]/edit`

- [ ] Same pattern as 1.1 for carousel
- [ ] Verify + Commit: `refactor: server-fetch carousel edit page`

### Task 1.3: Migrate `organization/[id]/edit`

- [ ] Same pattern for organization member edit
- [ ] Verify + Commit: `refactor: server-fetch organization edit page`

### Task 1.4: Migrate `events/[slug]/announcements/[id]/edit`

- [ ] Same pattern for event-scoped announcement edit
- [ ] Verify + Commit: `refactor: server-fetch event announcement edit page`

### Task 1.5: Migrate `introduction/edit`

- [ ] Special case: introduction has fetch-or-create (insert if not exists)
- [ ] Move fetch-or-create to page.tsx server component
- [ ] Client receives `initialIntroduction` — no more loading state
- [ ] Verify + Commit: `refactor: server-fetch introduction edit page`

---

## Phase 2: Hooks Extraction

**Design fixes from review:**
- All hooks use `useRef(createClient())` for stable supabase reference
- `uploadFn` stabilized via useRef (same pattern as `useAutoSave.onSaveRef`)
- `useContentEditor.publish()` uses optional `statusField` param instead of assuming `data.status`
- `useContentEditor` supports `onBeforeSave` and `onAfterSave` callbacks
- `useCrudList` accepts `initialItems` and `onCreated` callback

### Task 2.1: Create `useImageUpload`

**File:** `hooks/use-image-upload.ts` (~35 lines)

- [ ] Create hook: `uploadFn` stabilized via `useRef`, returns `{ isUploading, fileInputRef, triggerFileInput, handleFileChange }`
- [ ] `handleFileChange` returns `string | null` (URL or null on error), calls `toast.error` on failure
- [ ] Verify + Commit: `feat: add useImageUpload hook`

### Task 2.2: Create `useContentEditor`

**File:** `hooks/use-content-editor.ts` (~90 lines)

- [ ] Generic `<T>` with options: `table`, `id`, `initialData`, `fields`, `redirectTo`, `publishable?`, `statusField?`, `onBeforeSave?`, `onAfterSave?`
- [ ] Uses `useRef(createClient())` — supabase not in useCallback deps
- [ ] `buildPayload` inlined into `save`/`publish` (not separate useCallback)
- [ ] `publish` uses `statusField ?? "status"` to read/write status
- [ ] `save` calls `onBeforeSave?.()` (return false to abort) then save, then `onAfterSave?.()`
- [ ] Composes `useAutoSave` internally
- [ ] Returns: `{ data, setData, hasChanges, isSaving, isPublishing, isDeleting, save, publish, remove, guardNavigation }`
- [ ] Verify + Commit: `feat: add useContentEditor hook`

### Task 2.3: Create `useCrudList`

**File:** `hooks/use-crud-list.ts` (~60 lines)

- [ ] Options: `table`, `orderBy`, `ascending?`, `initialItems?`, `onCreated?`
- [ ] If `initialItems` provided, skip mount fetch
- [ ] `create` calls `onCreated?.(item)` after successful insert (for navigation)
- [ ] `remove` does optimistic local filter + toast.error on failure
- [ ] Verify + Commit: `feat: add useCrudList hook`

### Task 2.4: Create `useDialogForm`

**File:** `hooks/use-dialog-form.ts` (~50 lines)

- [ ] Options: `table`, `editingId`, `getDefaults` (stabilized via useRef), `buildPayload`, `validate?`, `onClose`
- [ ] `resetForm(data?)` for re-initialization when dialog prop changes
- [ ] `save` supports single-table only. Components with multi-table save (recruitment) use form state only
- [ ] Verify + Commit: `feat: add useDialogForm hook`

### Task 2.5: Create `useEventActions`

**File:** `hooks/use-event-actions.ts` (~50 lines)

- [ ] `useEventActions(eventId, slug, userId)` returns `{ isCreating, createAnnouncement, createResult, togglePin }`
- [ ] `togglePin(table: "results" | "competitions", id, pinned)` — generic for both
- [ ] Verify + Commit: `feat: add useEventActions hook`

### Task 2.6: Create `useProfileEditor`

**File:** `hooks/use-profile-editor.ts` (~120 lines)

- [ ] Extract from `app/profile/[id]/client.tsx`: `saveField`, `saveLinks`, link management, external results CRUD, dialog state
- [ ] Accepts `userId`, `initialProfile`, `initialExternalResults`, `refreshProfile`
- [ ] Verify + Commit: `feat: add useProfileEditor hook`

### Tasks 2.7–2.19: Migrate all pages/components to hooks

Each task: read file → replace inline CRUD with hook → verify → commit.

| Task | File | Hook(s) |
|------|------|---------|
| 2.7 | `app/announcement/[id]/edit/client.tsx` | `useContentEditor` |
| 2.8 | `app/events/[slug]/announcements/[id]/edit/client.tsx` | `useContentEditor` |
| 2.9 | `app/contacts/[id]/edit/client.tsx` | `useContentEditor` (publishable: false) |
| 2.10 | `app/events/[slug]/results/[id]/edit/client.tsx` | `useContentEditor` + `useImageUpload` |
| 2.11 | `app/carousel/[id]/edit/client.tsx` | `useContentEditor` (publishable: false) + `useImageUpload` |
| 2.12 | `app/events/[slug]/edit/client.tsx` | `useContentEditor` (onBeforeSave for slug check, onAfterSave for router.replace) + `useImageUpload` |
| 2.13 | `app/introduction/edit/client.tsx` | `useContentEditor` |
| 2.14 | `app/organization/[id]/edit/client.tsx` | `useContentEditor` + `useImageUpload` |
| 2.15 | `app/carousel/client.tsx` | `useCrudList` (initialItems from server, onCreated: navigate to edit) |
| 2.16 | `app/contacts/client.tsx` | `useCrudList` (same pattern) |
| 2.17 | `components/organization-member-dialog.tsx` | `useDialogForm` + `useImageUpload` |
| 2.18 | `components/recruitment-dialog.tsx` | `useDialogForm` (form state only) + `useImageUpload`. Keep custom `handleSave` for two-table write |
| 2.19 | `app/events/[slug]/client.tsx` | `useEventActions` |
| 2.20 | `app/profile/[id]/client.tsx` | `useProfileEditor` + `useImageUpload` (×2: external result image + resume) |
| 2.21 | `components/result-tag-sidebar.tsx` | Keep inline — tree CRUD is unique. Clean up to use `useRef(createClient())` |

---

## Phase 3: UI Consistency

### Task 3.1: Unify pin button position

- [ ] `components/recruitment-card.tsx` — move pin button from `top-2 left-2` to `top-2 right-2` (match result-card)
- [ ] Move edit button to avoid collision (e.g., below pin or different position)
- [ ] Verify visually + Commit: `fix: unify pin button position across cards`

### Task 3.2: Unify status badge display

- [ ] Define one pattern: use `Badge` component everywhere (not inline colored text)
- [ ] `components/announcement-table.tsx` — replace colored text with Badge
- [ ] `app/events/[slug]/client.tsx` announcement tab — same
- [ ] `components/recruitment-card.tsx` — recruitment has no status field yet (see Phase 4 data fix), skip for now
- [ ] Commit: `fix: unify status badge to Badge component`

### Task 3.3: Unify empty states

- [ ] Create shared `EmptyState` component: icon + title + description + optional action button
- [ ] Replace all inline empty states: event tabs (×3), announcement list, organization
- [ ] Match the existing Card-based pattern from carousel/contacts
- [ ] Commit: `refactor: unify empty states with shared EmptyState component`

### Task 3.4: Add sticky toolbar to missing edit pages

- [ ] `app/contacts/[id]/edit/client.tsx` — add sticky toolbar (same as other edit pages)
- [ ] `app/organization/[id]/edit/client.tsx` — restructure to use sticky toolbar at top
- [ ] Commit: `fix: add sticky toolbar to contacts and organization edit`

### Task 3.5: Add missing loading.tsx

- [ ] `app/carousel/loading.tsx` — skeleton matching carousel list layout
- [ ] `app/contacts/loading.tsx` — skeleton matching contacts list layout
- [ ] Commit: `feat: add loading skeletons for carousel and contacts`

### Task 3.6: Unify empty state wording

- [ ] Standardize to `尚無{entity}` format (e.g., 尚無公告、尚無成果、尚無徵才資訊)
- [ ] All empty states include helpful description text
- [ ] Commit: `fix: standardize empty state wording`

---

## Phase 4: Error Handling & Data Fixes

### Task 4.1: Add toast.error to all silent failures

All CRUD operations must show `toast.error` on failure. Files to fix:

- [ ] `app/announcement/[id]/edit/client.tsx` — save, publish, delete
- [ ] `app/events/[slug]/announcements/[id]/edit/client.tsx` — save, publish, delete
- [ ] `app/events/[slug]/edit/client.tsx` — save, publish, delete
- [ ] `app/events/[slug]/results/[id]/edit/client.tsx` — save (publish already has toast)
- [ ] `app/introduction/edit/client.tsx` — save
- [ ] `app/contacts/client.tsx` — create, delete
- [ ] `app/carousel/client.tsx` — create, delete
- [ ] `app/announcement/client.tsx` — create
- [ ] `app/events/[slug]/client.tsx` — pin toggles

Note: if Phase 2 is done first, most of these are handled by the hooks (`useContentEditor` shows toast on error). Only pin toggles and list operations need manual fixes.

- [ ] Commit: `fix: add toast.error to all silent CRUD failures`

### Task 4.2: Unify delete confirmation to AlertDialog

- [ ] Replace all `window.confirm()` with shadcn AlertDialog
- [ ] 9 locations across edit pages and list pages
- [ ] Standard message: title + "此操作無法復原" description
- [ ] Consider creating a shared `ConfirmDeleteDialog` component
- [ ] Commit: `refactor: replace window.confirm with AlertDialog`

### Task 4.3: Fix announcement create missing default date

- [ ] `app/events/[slug]/client.tsx` `handleCreateAnnouncement` — add `date: new Date().toISOString().slice(0, 10)`
- [ ] `app/announcement/client.tsx` — same fix if applicable
- [ ] Commit: `fix: add default date to announcement creation`

### Task 4.4: Unify date display with formatDate

- [ ] `components/announcement-detail.tsx` — replace raw `{date}` with `formatDate(date)`
- [ ] `app/events/[slug]/client.tsx` announcement table — replace raw `{item.date}` with `formatDate(item.date)`
- [ ] `components/announcement-table.tsx` — same
- [ ] Commit: `fix: use formatDate consistently for announcement dates`

### Task 4.5: Add delete spinners to list pages

- [ ] `app/carousel/client.tsx` — add Loader2 spinner to delete button when `deletingId === id`
- [ ] `app/contacts/client.tsx` — same
- [ ] Commit: `fix: add delete spinners to list pages`

---

## Phase 5: SEO

### Task 5.1: Add recruitment to sitemap

- [ ] `app/sitemap.ts` — add query for `competitions` table with published events, generate `/events/{slug}/recruitment/{id}` URLs
- [ ] Commit: `feat: add recruitment pages to sitemap`

### Task 5.2: Fix privacy title format

- [ ] `app/privacy/page.tsx` — change title from `"隱私權政策 — 國立陽明交通大學 人工智慧專責辦公室"` to `"隱私權政策｜人工智慧專責辦公室"` (match pipe format)
- [ ] Commit: `fix: consistent title separator for privacy page`

### Task 5.3: Add JSON-LD to missing pages

- [ ] `app/introduction/page.tsx` — add `WebPage` or `AboutPage` schema
- [ ] `app/organization/page.tsx` — add `ItemList` with nested `Person` schemas
- [ ] `app/events/[slug]/announcements/[id]/page.tsx` — add `NewsArticle` schema
- [ ] `app/events/[slug]/results/[id]/page.tsx` — add `CreativeWork` schema
- [ ] `app/privacy/page.tsx` — add `WebPage` schema
- [ ] Commit: `feat: add JSON-LD structured data to missing pages`

### Task 5.4: Fix recruitment OG image

- [ ] `app/events/[slug]/recruitment/[id]/page.tsx` — use recruitment `image` or event `cover_image` for OG
- [ ] Commit: `fix: add OG image for recruitment detail page`

---

## Phase 6: Polish

### Task 6.1: Fix recruitment-dialog responsive grids

- [ ] Line 562: `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- [ ] Lines 480, 536, 679: `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- [ ] Commit: `fix: responsive grid breakpoints in recruitment dialog`

### Task 6.2: Fix hardcoded colors

- [ ] `app/organization/org-chart.tsx:264` — `text-gray-400` → `text-muted-foreground`
- [ ] `components/vendor-events-section.tsx:92-98` — hardcoded badge colors → semantic tokens or verify WCAG contrast
- [ ] Commit: `fix: replace hardcoded colors with semantic tokens`

### Task 6.3: Add image `sizes` prop

- [ ] All `<Image fill>` without `sizes` — add appropriate `sizes` prop based on container
- [ ] Commit: `perf: add sizes prop to responsive images`

### Task 6.4: Carousel keyboard accessibility

- [ ] `components/carousel-client.tsx` — add `onFocus`/`onBlur` handlers for autoplay control
- [ ] Make prev/next buttons visible on focus (add `group-focus-within:opacity-100`)
- [ ] Commit: `a11y: carousel keyboard accessibility`

### Task 6.5: Lazy-load TiptapEditor

- [ ] Create `components/tiptap-editor-lazy.tsx` using `next/dynamic` with `ssr: false`
- [ ] Replace imports in all 5 edit pages
- [ ] Commit: `perf: lazy-load TiptapEditor`

### Task 6.6: Update CLAUDE.md

- [ ] Add hooks documentation (useContentEditor, useImageUpload, useCrudList, useDialogForm, useEventActions, useProfileEditor)
- [ ] Add error handling convention (toast.error on all failures, AlertDialog for deletes)
- [ ] Add empty state convention (shared EmptyState component)
- [ ] Commit: `docs: update CLAUDE.md with refactor conventions`

---

## Final Verification

- [ ] `bun run check` (97+ tests pass, typecheck clean)
- [ ] `bun run lint`
- [ ] Grep: no `supabase.from()` in components/ except auth-provider.tsx (and result-tag-sidebar.tsx as documented exception)
- [ ] Grep: no `window.confirm()` remaining
- [ ] Grep: no `console.error` without accompanying `toast.error`
- [ ] Visual spot-check: pin buttons, empty states, sticky toolbars, status badges consistent across pages
