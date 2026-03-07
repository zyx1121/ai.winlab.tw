# Profile Page Redesign — 2026-03-08

## Goal

Redesign `/profile/[id]` inspired by Medium's author profile layout (`/about` page):
- Two-column responsive layout (sidebar + content)
- Inline edit mode for owners
- Clean, minimal typography

## Layout

### Desktop (≥ 768px)

Two-column CSS grid:
- Left column: `w-72` (288px), `sticky top-20`
- Right column: `flex-1`, scrollable
- Gap between columns: `gap-12`
- Page wrapper: `max-w-6xl mx-auto px-4 py-12`

### Mobile (< 768px)

Single column — left column content stacks above right column content.

## Left Column — Profile Card

### View Mode

```
[Edit 按鈕]  ← ghost button, owner-only, top-right

[avatar 128px circle]

姓名          ← text-2xl font-bold
N 篇個人成果  ← text-sm text-muted-foreground

自我介紹...   ← text-sm leading-relaxed, whitespace-pre-wrap

𝗶𝗻  𝗳𝗯  𝗚𝗛  🌐  📄  ← icon links, w-5 h-5, gap-3, text-muted-foreground hover:text-foreground
https://extra.com     ← extra links, truncated
```

No card border — plain layout directly on page background.

### Inline Edit Mode (owner toggles via Edit button)

When edit mode is active:
- Each editable field shows a small pencil icon (`✎`) on hover
- Clicking a field replaces it with an input (underline style, no border box)
- On blur: auto-save to Supabase
- While saving: show `Loader2` spinner inline, replace with saved value on completion

Editable fields:
- **姓名** → `<input>` underline style, single line
- **bio** → `<textarea>` underline style, auto-resize, multi-line
- **Social links** (LinkedIn, Facebook, GitHub, Website, Resume) → clicking the icon or a "+ add" affordance expands a URL input inline
- **Extra links** → each link editable, with delete button; "+ 新增連結" button at bottom

Avatar: display-only (no upload in this redesign scope, avatar_url field remains).

Edit button label: "編輯資料" when inactive, "完成編輯" when active.

## Right Column — Results List

### Header

```
個人成果  ─────────────────────────────────  [+ 新增個人成果]
                                              (owner + edit mode only)
```

### Each Result Row (Medium article list style)

```
┌────────────────────────────────────────────────────────┐
│                                          ┌──────────┐  │
│  2024-11-15   [草稿 badge]               │          │  │
│                                          │ thumbnail│  │
│  成果標題（text-xl font-bold,            │ w-28 h-20│  │
│  line-clamp-2）                          │ rounded  │  │
│                                          └──────────┘  │
│  摘要文字，最多兩行截斷...                              │
│                                                        │
├────────────────────────────────────────────────────────┤
```

- Title: `text-xl font-bold line-clamp-2`, hover → underline
- Summary: `text-sm text-muted-foreground line-clamp-2`
- Date + status badge: above title, same row
- Thumbnail: `w-28 h-20 rounded-lg object-cover`, right-aligned; omitted if no image
- Separator between items: `<Separator />`
- Click behavior: owner → `/result/[id]/edit`; visitor → `/result/[id]`

### Empty State

```
尚無成果紀錄
```

## Data & Auth

No new data fetching needed — `page.tsx` already fetches profile + results.

Owner-only visibility:
- Edit button in left column
- Draft status badges in result rows
- "+ 新增個人成果" button

Filter: non-owners only see `status: published` results (already handled in `page.tsx`).

## Files to Modify

- `app/profile/[id]/client.tsx` — full rewrite of view/edit UI
- No changes needed to `page.tsx`, `layout.tsx`, or `loading.tsx`

## Out of Scope

- Avatar upload
- Cover/banner image
- Pagination of results
- Follower/follow functionality
