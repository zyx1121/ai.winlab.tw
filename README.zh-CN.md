<!-- 翻译自 README.md @ docs/readme-template-v2。只翻译 "For AI agents" 之前的章节，英文版更新时一起改。 -->

<div align="center">

<h1>NYCU AI Office</h1>

<p><strong>阳明交大人工智能专责办公室的网站，由办活动的人自己编辑。</strong></p>

[![CI](https://img.shields.io/github/actions/workflow/status/zyx1121/ai.winlab.tw/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/zyx1121/ai.winlab.tw/actions)
[![Live](https://img.shields.io/badge/live-ai.winlab.tw-000000?style=flat-square)](https://ai.winlab.tw)
[![License](https://img.shields.io/github/license/zyx1121/ai.winlab.tw?style=flat-square)](LICENSE.md)

[English](README.md) | [繁體中文](README.zh-TW.md) | **简体中文**

</div>

![NYCU AI Office social card](public/og.png)

办公室要办活动、招募和发表成果，每一项在决定的当天就需要一个页面。每种内容都有自己的网页编辑器，所以办活动的人可以直接发布。

## 功能

- **发布内容**：公告、活动页、成果和招募，可以属于某个活动或全站共用。
- **直接编辑**：Tiptap 编辑器支持图片、YouTube 嵌入，每种内容都会自动保存。
- **按角色控制**：管理员能读写全部，厂商管理自己活动的招募，其他人只看得到已发布的内容。
- **记录参与**：活动参与者和成果共同作者，置顶的活动和成果会出现在首页。

## 快速开始

```sh
git clone https://github.com/zyx1121/ai.winlab.tw && cd ai.winlab.tw
bun install
printf 'NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=\n' > .env.local   # 填入你的 Supabase 密钥
bun dev
```

打开 http://localhost:3000，应该会看到有轮播和最新公告的首页。

## 使用方法

| 角色 | 能看和能做的事 |
|------|----------------|
| 未登录 | 只有已发布的内容 |
| 已登录 | 自己的草稿和所有已发布的内容 |
| 管理员 | 所有数据表的完整读写 |
| 厂商 | 被指派活动下的招募 |

- 每个内容页都有 `/edit` 页面，给有写入权限的角色使用。
- 在 Supabase SQL editor 依次应用 `supabase/migrations/` 里的 32 个 SQL migration，每张数据表都有 row-level security。
- 上传的图片存在公开的 `announcement-images` 存储桶。

## 配置

| 参数 | 作用 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase 公开密钥 |

## 工作原理

| 层 | 选择 |
|----|------|
| 框架 | Next.js 16(App Router) |
| 后端 | Supabase(带 RLS 的 Postgres、Storage) |
| 样式 | Tailwind CSS 4 和 shadcn/ui |
| 编辑器 | Tiptap，内容存为 JSON |

网站由 Vercel 构建并托管在 [ai.winlab.tw](https://ai.winlab.tw)。角色权限由 Postgres 的 row-level security 执行，浏览器永远不决定访问权限。

## 其他

给 AI agent 的结构化信息与开发说明见[英文版](README.md#for-ai-agents)。

## 许可证

[MIT](LICENSE.md)
