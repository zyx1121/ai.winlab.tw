<!-- 翻譯自 README.md @ docs/readme-template-v2。只翻 "For AI agents" 以上的章節，英文版更新時一起改。 -->

<div align="center">

<h1>NYCU AI Office</h1>

<p><strong>陽明交大人工智慧專責辦公室的網站，由辦活動的人自己編輯。</strong></p>

[![CI](https://img.shields.io/github/actions/workflow/status/zyx1121/ai.winlab.tw/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/zyx1121/ai.winlab.tw/actions)
[![Live](https://img.shields.io/badge/live-ai.winlab.tw-000000?style=flat-square)](https://ai.winlab.tw)
[![License](https://img.shields.io/github/license/zyx1121/ai.winlab.tw?style=flat-square)](LICENSE.md)

[English](README.md) | **繁體中文** | [简体中文](README.zh-CN.md)

</div>

![NYCU AI Office social card](public/og.png)

辦公室要辦活動、招募和發表成果，每一項在決定的當天就需要一個頁面。每種內容都有自己的網頁編輯器，所以辦活動的人可以直接發布。

## 功能

- **發布內容**：公告、活動頁、成果和招募，可以屬於某個活動或全站共用。
- **直接編輯**：Tiptap 編輯器支援圖片、YouTube 嵌入，每種內容都會自動儲存。
- **依角色控管**：管理員能讀寫全部，廠商管理自己活動的招募，其他人只看得到已發布的內容。
- **記錄參與**：活動參與者和成果共同作者，置頂的活動和成果會出現在首頁。

## 快速開始

```sh
git clone https://github.com/zyx1121/ai.winlab.tw && cd ai.winlab.tw
bun install
printf 'NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=\n' > .env.local   # 填入你的 Supabase 金鑰
bun dev
```

打開 http://localhost:3000，應該會看到有輪播和最新公告的首頁。

## 使用方式

| 角色 | 能看和能做的事 |
|------|----------------|
| 未登入 | 只有已發布的內容 |
| 已登入 | 自己的草稿和所有已發布的內容 |
| 管理員 | 所有資料表的完整讀寫 |
| 廠商 | 被指派活動底下的招募 |

- 每個內容頁都有 `/edit` 頁面，給有寫入權限的角色使用。
- 在 Supabase SQL editor 依序套用 `supabase/migrations/` 裡的 32 個 SQL migration，每張資料表都有 row-level security。
- 上傳的圖片存在公開的 `announcement-images` 儲存桶。

## 設定

| 參數 | 作用 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案網址 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase 公開金鑰 |

## 運作方式

| 層 | 選擇 |
|----|------|
| 框架 | Next.js 16(App Router) |
| 後端 | Supabase(有 RLS 的 Postgres、Storage) |
| 樣式 | Tailwind CSS 4 和 shadcn/ui |
| 編輯器 | Tiptap，內容存成 JSON |

網站由 Vercel 建置並託管在 [ai.winlab.tw](https://ai.winlab.tw)。角色權限由 Postgres 的 row-level security 執行，瀏覽器永遠不決定存取權。

## 其他

給 AI agent 的結構化資訊與開發說明在[英文版](README.md#for-ai-agents)。

## 授權

[MIT](LICENSE.md)
