# 頁面結構

## 首頁（`/`）
Server Components 組合，各自獨立 fetch：`HomeCarousel`, `HomeIntroduction`, `HomeAnnouncement`, `HomeEvents`, `HomeContacts`。

## 活動系統（`/events`）
- `/events` — 活動列表
- `/events/[slug]` — 活動詳情，含公告/成果/招募三分頁
- `/events/[slug]/edit` — admin 編輯活動 metadata
- `/events/[slug]/announcements/[id]`、`/edit`
- `/events/[slug]/results/[id]`、`/edit`
- `/events/[slug]/recruitment/[id]` — 公開檢視，vendor/admin 可看應徵清單

## 內容管理
- `/announcement`、`/announcement/[id]`、`/announcement/[id]/edit`
- `/introduction`、`/introduction/edit`
- `/organization`、`/organization/[id]/edit`
- `/carousel/[id]/edit`、`/contacts/[id]/edit`
- `/privacy`、`/privacy/edit`

## 帳號與個人頁面
- `/account` — 個人資料
- `/profile/[id]` — 公開作者頁，vendor 可見 "My Events" 區塊

## Admin 專用
- `/settings`、`/settings/users` — 使用者管理
