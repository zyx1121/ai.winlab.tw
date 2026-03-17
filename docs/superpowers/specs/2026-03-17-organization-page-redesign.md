# Organization Page Redesign Spec
**Date:** 2026-03-17
**Status:** Approved

---

## Overview

Redesign the `/organization` page for the NYCU AI Office website to display:
1. A visual org chart (SVG connectors + Tailwind nodes) matching the official AI Office structure
2. A tabbed member section with three tabs: 核心成員 | 法人 | 產業

---

## Page Structure

```
/organization
├── Title: AI 專責辦公室組織架構
├── OrgChart (static, SVG connectors + Tailwind nodes)
│   ├── Solid lines: 主任 → 副主任×2 → [合聘專家 / 培訓團隊 / 應用團隊]
│   └── Dashed lines: 法人 ⟷ (聯盟) ⟷ 產業 (horizontal, through center)
└── Member Section
    ├── Tabs: 核心成員 | 法人 | 產業
    ├── 核心成員: 4 professors with detailed cards
    ├── 法人: empty for now, DB-managed (admin can add)
    └── 產業: empty for now, DB-managed (admin can add)
```

---

## Org Chart Nodes

The following nodes are hardcoded in the static component:

| Node | Title | Person | Affiliation |
|------|-------|--------|-------------|
| 主任 | 主任 | 曾建超教授 | 資訊學院 |
| 副主任（左） | 副主任 | 黃俊龍副院長 | 資訊學院 |
| 副主任（右） | 副主任 | 陳建志所長 | 智慧綠能學院 |
| 合聘專家 | 合聘專家 | 許懷中教授 | 逢甲AI中心主任 |
| 培訓團隊 | 培訓團隊 | （資訊技術中心） | — |
| 應用團隊 | 應用團隊 | （教授與實驗室） | — |
| 法人 | 法人 | 聯盟 | — |
| 產業 | 產業 | 聯盟 | — |

**Technical approach:** Nodes are Tailwind-styled `div`s positioned via CSS Grid. An SVG element is absolutely positioned over the container. Line coordinates are computed from known grid cell positions (relative percentages), not from DOM measurements. Solid lines for hierarchy, dashed lines for alliance relationships.

---

## Member Cards

Each card shows:
- Photo (square, object-cover)
- Name (large, bold)
- Role/Position (e.g., 主任、副主任)
- 學校（最高學歷）
- 研究領域
- Email (with mailto: link)
- 個人網頁 (external link)

---

## DB Migration

File: `supabase/migrations/YYYYMMDDHHMMSS_update_organization_members.sql`

```sql
-- Step 1: Drop default/constraint, add new columns
ALTER TABLE organization_members
  ADD COLUMN school TEXT,
  ADD COLUMN research_areas TEXT,
  ADD COLUMN email TEXT,
  ADD COLUMN website TEXT,
  ADD COLUMN role TEXT;

-- Step 2: Create new enum type
CREATE TYPE organization_member_category_new
  AS ENUM ('core', 'legal_entity', 'industry');

-- Step 3: Migrate existing rows (map all old values → 'core')
ALTER TABLE organization_members
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN category TYPE organization_member_category_new
    USING 'core'::organization_member_category_new;

-- Step 4: Swap enum type
DROP TYPE organization_member_category;
ALTER TYPE organization_member_category_new
  RENAME TO organization_member_category;
```

---

## TypeScript Types

Update `lib/supabase/types.ts`:

```ts
export type OrganizationMemberCategory =
  | "core"
  | "legal_entity"
  | "industry";

export type OrganizationMember = {
  id: string;
  created_at: string;
  updated_at: string;
  category: OrganizationMemberCategory;
  name: string;
  summary: string | null;
  image: string | null;
  link: string | null;
  sort_order: number;
  // New fields
  school: string | null;
  research_areas: string | null;
  email: string | null;
  website: string | null;
  role: string | null;
};
```

---

## Initial Data (4 Core Professors)

To be inserted via migration or Supabase dashboard:

| Name | Role | School | Research | Email | Website |
|------|------|--------|----------|-------|---------|
| 曾建超教授 | 主任 | 美國南美以美大學（資工博士） | 軟體定義網路/NFV、DevOps雲原生 | cctseng@cs.nycu.edu.tw | https://sites.google.com/view/cctseng |
| 黃俊龍教授 | 副主任 | 國立台灣大學（電機博士） | 資料分析、資料探勘、區塊鏈 | jlhuang@cs.nycu.edu.tw | http://www.cs.nycu.edu.tw/~jlhuang/ |
| 陳建志教授 | 副主任 | 國立陽明交通大學（資工博士） | AI/IoT、5G無線通訊、機器人 | jenjee@nycu.edu.tw | https://people.cs.nycu.edu.tw/~chencz/ |
| 許懷中教授 | 合聘專家 | 逢甲大學（副教授） | — | hwaijhsu@o365.fcu.edu.tw | — |

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `supabase/migrations/xxx_update_organization_members.sql` | Create: DB migration |
| `lib/supabase/types.ts` | Modify: update OrganizationMemberCategory + OrganizationMember |
| `app/organization/org-chart.tsx` | Create: static org chart component |
| `app/organization/page.tsx` | Modify: fetch new fields |
| `app/organization/client.tsx` | Modify: 3 tabs + new card UI |
| `app/organization/[id]/edit/page.tsx` | Modify: add form fields for school/research_areas/email/website/role |

---

## Out of Scope

- Org chart is static (not DB-driven); structure changes require code edits
- No pagination for member tabs (small expected count)
- No search/filter within tabs
