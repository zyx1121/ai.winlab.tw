# Recruitment Refactor Design

Date: 2026-03-11

## Summary

Refactor the recruitment system to support rich company/job data, a public detail page, and admin editing via Sheet dialog (no page navigation).

## Data Model Changes

### `competitions` table migration

**Rename:**
- `date` → `start_date`
- `description` → `company_description`

**Add:**
| Column | Type | Description |
|--------|------|-------------|
| `end_date` | `date` | Recruitment end date |
| `application_method` | `jsonb` | `{ email?: string, url?: string, other?: string }` |
| `contact` | `jsonb` | `{ name?: string, email?: string, phone?: string }` |
| `required_documents` | `text` | Required application documents (optional) |

**Remove:**
- `location` (unused; location info lives in positions JSON)

### `positions` JSONB schema (expanded)

```typescript
type RecruitmentPosition = {
  name: string;                // Job title
  location: string | null;     // Work location
  type: 'full_time' | 'internship' | 'part_time' | 'remote';
  count: number;               // Headcount
  salary: string | null;       // Salary range (free text)
  responsibilities: string | null; // Job description
  requirements: string | null;     // Required qualifications
  nice_to_have: string | null;     // Nice-to-have qualifications
};
```

### Updated `Recruitment` TypeScript type

```typescript
type ApplicationMethod = {
  email?: string;
  url?: string;
  other?: string;
};

type ContactInfo = {
  name?: string;
  email?: string;
  phone?: string;
};

type Recruitment = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;                          // Company name
  link: string;                           // Company website
  image: string | null;                   // Cover image
  company_description: string | null;     // Company intro (max 300 chars)
  start_date: string;                     // Recruitment start date
  end_date: string | null;                // Recruitment end date
  positions: RecruitmentPosition[] | null;
  application_method: ApplicationMethod | null;
  contact: ContactInfo | null;
  required_documents: string | null;
  event_id: string | null;
};
```

## Route Changes

| Route | Action | Description |
|-------|--------|-------------|
| `/events/[slug]?tab=recruitment` | Modify | Cards link to detail page; admin add/edit via Sheet |
| `/events/[slug]/recruitment/[id]` | **New** | Public detail page (server component) |
| `/events/[slug]/recruitment/[id]/edit` | **Delete** | Replaced by Sheet dialog |
| `/recruitment` | Modify | Same pattern: cards → detail page, admin uses Sheet |
| `/recruitment/[id]` | **New** | Global recruitment detail page |
| `/recruitment/[id]/edit` | **Delete** | Replaced by Sheet dialog |

## Components

### `recruitment-card.tsx` (modify)

Simplified display:
- Cover image
- Company name (title)
- Company description (2-line clamp)
- Position count badge (e.g., "3 positions")
- Recruitment period (`start_date` ~ `end_date`)
- "Closed" badge if `end_date < today`
- Admin: edit button (top-right, opens Sheet, `e.preventDefault()`)
- Click → navigates to detail page

### `recruitment-detail.tsx` (new)

Full data display, shared between `/events/[slug]/recruitment/[id]` and `/recruitment/[id]`:
1. **Header** — cover image + company name + website link
2. **Company intro** — text paragraph
3. **Recruitment info** — period + required documents
4. **Job positions** — each position shows all fields (title, location, type, headcount, salary, responsibilities, requirements, nice-to-have)
5. **Application method** — email (mailto) / URL (external link) / other text
6. **Contact** — name, email (mailto), phone (tel link)

### `recruitment-dialog.tsx` (new)

- Uses shadcn `Sheet` (slides from right, ~640px wide)
- Form sections match data model
- Position list: dynamic add/remove, each collapsible
- Image upload: immediate upload to Storage, store URL
- Bottom: Save button + Delete button (with AlertDialog confirmation)
- No auto-save; explicit save action
- On save success: close Sheet → `router.refresh()`

## Data Flow

### List page (`/events/[slug]?tab=recruitment`)
1. Server component fetches recruitments → passes to client
2. Client renders card grid + manages Sheet state
3. Admin: add/edit → Sheet → save → close → `router.refresh()`

### Detail page (`/events/[slug]/recruitment/[id]`)
1. Server component fetches single recruitment
2. Pure display via `recruitment-detail.tsx`
3. Back button → `/events/[slug]?tab=recruitment`

### Create flow
- Open empty Sheet → fill all fields → save → single INSERT
- Image uploaded immediately on selection (existing pattern)

### Delete flow
- Delete button in Sheet → AlertDialog confirmation → DELETE → close → refresh

## Authorization

No changes to existing RLS policies:
- Public: read all recruitments
- Admin: full CRUD via Sheet
- Non-admin: view only (cards → detail page)
