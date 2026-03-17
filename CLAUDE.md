# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

```bash
bun dev       # 開發伺服器
bun build     # 正式建置
bun start     # 正式伺服器
bun lint      # ESLint
```

套件管理一律使用 **bun**（不是 npm/yarn/pnpm），新增套件用 `bunx shadcn add <name>`。

## 環境變數

`.env.local` 需要：
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## 架構概述

**Next.js 16 App Router** + **Supabase**（DB + Auth + Storage）+ **Tailwind CSS v4** + **shadcn/ui**

### Supabase 客戶端選擇

| 情境 | 匯入路徑 |
|------|----------|
| Client Component | `@/lib/supabase/client` |
| Server Component / Route Handler | `@/lib/supabase/server`（async） |
| proxy.ts（middleware） | `@/lib/supabase/proxy` |

### 授權邏輯

`AuthProvider`（`components/auth-provider.tsx`）包裹整個 app，提供 `useAuth()`：`user`, `profile`, `isAdmin`, `isLoading`, `signIn`, `signOut`。

- 未登入 → 只看 `status: published` 的資料
- 登入非 admin → 可看自己的草稿 + 所有 published
- admin → 完整讀寫權限（`profile.role === 'admin'`）

Server Component 中需自行查 `profiles` 表取得 `isAdmin`（參考 `app/events/[slug]/page.tsx`）。

### 根 Layout 特殊行為

`app/layout.tsx` 在 Server Component 中查詢 `events` 表取得 `pinned=true` 的活動，傳給 `<Header pinnedEvents={...} />`，用於在導覽列動態顯示置頂活動連結。

## 資料模型（`lib/supabase/types.ts`）

主要實體：

- **Announcement** — 公告，Tiptap JSON 內容，`status: draft|published`，`event_id`（null = 全域）
- **Result** — 競賽/活動成果，`type: personal|team`，`pinned`，`event_id`（null = 全域）
- **Recruitment**（DB table: `competitions`）— 招募，`event_id`，包含 JSON 欄位：`positions: RecruitmentPosition[]`、`application_method: ApplicationMethod`、`contact: ContactInfo`
- **Event** — 活動，`slug`（unique），`status: draft|published`，`pinned`，`sort_order`
- **Introduction** — 單筆辦公室介紹，Tiptap JSON 內容
- **OrganizationMember** — `category: core|legal_entity|industry`
- **Profile** — 繼承 `auth.users`，`role: admin|user`，含 `phone`, `bio`, `linkedin`, `facebook`, `github`, `website`, `resume`, `social_links`
- **ExternalResult** — 使用者自行提交的外部成果連結
- **Tag / ResultTag** — 成果的標籤系統（樹狀結構，`parent_id`）
- **Team / TeamMember / TeamInvitation** — 團隊管理
- **CarouselSlide**, **Contact** — 首頁輪播與聯絡資訊

`event_id IS NULL` → 屬於全域頁面；`IS NOT NULL` → 屬於特定活動。

## 頁面結構

### 首頁（`/`）
Server Components 組合，各自獨立 fetch：`HomeCarousel`, `HomeIntroduction`, `HomeOrganization`, `HomeAnnouncement`, `HomeEvents`, `HomeContacts`。

### 活動系統（`/events`）
- `/events` — 活動列表（client）
- `/events/[slug]` — 活動詳情，含公告/成果/招募三分頁（server + client）
- `/events/[slug]/edit` — admin 編輯活動 metadata
- `/events/[slug]/announcements/[id]`、`/edit`
- `/events/[slug]/results/[id]`、`/edit`（非 admin 可建立自己的成果）
- `/events/[slug]/recruitment/[id]/page.tsx`（admin only）

### 內容管理（需登入）
- `/announcement`、`/announcement/[id]`、`/announcement/[id]/edit`
- `/result`（全域，目前未使用，成果移至活動下）
- `/recruitment` — 全域招募列表（DB table: `competitions`）
- `/introduction`、`/introduction/edit`
- `/organization`、`/organization/[id]/edit`
- `/carousel/[id]/edit`、`/contacts/[id]/edit`

### 帳號與個人頁面
- `/account` — 個人資料 + 隊伍 + 邀請
- `/account/teams`、`/account/teams/[id]`
- `/profile/[id]` — 公開作者頁（個人資料 + 發布文章）
- `/team/[id]` — 公開團隊頁

### Admin 專用
- `/settings` — 使用者管理

## 共用 Hooks 與工具

### `useAutoSave`（`hooks/use-auto-save.ts`）
所有編輯頁面都使用此 hook，自動 debounce 儲存（預設 3 秒）。提供 `guardNavigation` 防止未儲存就離開。

```ts
const { guardNavigation } = useAutoSave({ hasChanges, onSave });
```

### `nuqs`
URL 搜尋參數狀態管理，使用 `NuqsAdapter`（已在 root layout 包裹）。

## 富文字編輯（`components/tiptap-editor.tsx`）

`TiptapEditor` 用於 Announcement、Result、Introduction 等 content 欄位。內容儲存為 Tiptap JSON（`Record<string, unknown>`）。支援拖放/貼上圖片（呼叫 `uploadAnnouncementImage`）。

## 圖片上傳（`lib/upload-image.ts`）

Storage bucket：`announcement-images`（public）。路徑前綴：

| 用途 | 路徑 |
|------|------|
| Announcement inline 圖片 | root（無前綴） |
| Recruitment 封面 | `competitions/` |
| Result header 圖片 | `results/` |
| OrganizationMember 照片 | `organization/` |
| Event 封面 | `events/` |

`next/image` 已設定允許 `*.supabase.co` 的 remote pattern。

## UI 套件細節

- **shadcn/ui**（`components/ui/`）：基底 UI 元件
- **`@squircle-js/react`**：`Card` 元件使用 Squircle clip-path，SSR 時會有初始矩形 flash（已知問題）
- **`next-themes`**：`ThemeProvider` 在 root layout，預設 `light`
- **字型**：Noto Sans（`--font-noto-sans`）、Noto Sans Mono（`--font-noto-sans-mono`）

## 資料庫 Migrations

SQL migrations 放在 `supabase/migrations/`，依序在 Supabase SQL editor 執行。所有表均啟用 RLS。初次設置另需建立 `announcement-images` storage bucket（public）並執行 `supabase/storage-policies.sql`。
