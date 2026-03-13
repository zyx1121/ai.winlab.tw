# MCP Server Design — NYCU AI Office

**Date:** 2026-03-13
**Status:** Approved
**Repo:** mcp.ai.winlab.tw (new, independent)

## Overview

A remote MCP (Model Context Protocol) server that exposes the NYCU AI Office website's content management capabilities to AI agents. Deployed as a Next.js app on Vercel, sharing the same Supabase backend as the main site (ai.winlab.tw).

## Architecture

```
MCP Client (Claude Desktop, etc.)
    │
    │  Streamable HTTP + OAuth 2.1
    ▼
┌──────────────────────────────────────┐
│  mcp.ai.winlab.tw (Next.js/Vercel)   │
│                                       │
│  OAuth endpoints  →  Login UI         │
│  /mcp endpoint    →  MCP tools        │
│  Vercel KV        →  Auth code store  │
└──────────────┬───────────────────────┘
               │  Supabase JWT (pass-through)
               ▼
         Supabase (RLS enforced)
```

**Core concept:** The OAuth "access_token" IS the Supabase JWT. No custom tokens — the user's Supabase session is passed through directly, so RLS policies enforce the same permissions as the website.

## OAuth 2.1 Flow

1. MCP client discovers endpoints via `GET /.well-known/oauth-authorization-server`
2. Client redirects user to `/oauth/authorize` with PKCE code_challenge
3. User logs in via Supabase auth (email/password) on a React login page
4. Server generates auth_code, stores auth_code → Supabase session mapping in Vercel KV (TTL 5 min)
5. Redirects back to client with auth_code
6. Client exchanges auth_code + code_verifier at `POST /oauth/token`
7. Server returns Supabase access_token + refresh_token
8. Client sends Bearer token with each MCP request
9. Token refresh: client sends refresh_token to `/oauth/token` with `grant_type=refresh_token`

**Key decisions:**
- PKCE required (MCP OAuth 2.1 spec)
- Auth codes stored in Vercel KV with 5-minute TTL, single-use
- Dynamic client registration: accept any client_id without pre-registration

## MCP Tools (27 total)

All tools: read + create/update only. No delete operations.

### Announcements (4 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_announcements` | List announcements | `event_id?`, `status?`, `category?`, `limit?`, `offset?` |
| `get_announcement` | Get single announcement | `id` |
| `create_announcement` | Create announcement | `title`, `content`, `content_format?` (md\|tiptap), `category`, `date`, `status?`, `event_id?` |
| `update_announcement` | Update announcement | `id`, all fields optional |

### Results (4 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_results` | List results | `event_id?`, `status?`, `type?`, `limit?`, `offset?` |
| `get_result` | Get single result | `id` |
| `create_result` | Create result | `title`, `summary`, `content`, `content_format?`, `date`, `type`, `status?`, `event_id?`, `team_id?` |
| `update_result` | Update result | `id`, all fields optional |

### Recruitment (4 tools, DB table: `competitions`)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_recruitments` | List recruitments | `event_id?`, `limit?`, `offset?` |
| `get_recruitment` | Get single recruitment | `id` |
| `create_recruitment` | Create recruitment | `title`, `link`, `image?`, `company_description?`, `start_date`, `end_date?`, `positions?`, `application_method?`, `contact?`, `event_id?` |
| `update_recruitment` | Update recruitment | `id`, all fields optional |

### Events (4 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_events` | List events | `status?`, `pinned?`, `limit?`, `offset?` |
| `get_event` | Get event (by id or slug) | `id` or `slug` |
| `create_event` | Create event | `name`, `slug`, `description?`, `status?`, `pinned?`, `sort_order?`, `cover_image?` |
| `update_event` | Update event | `id`, all fields optional |

### Contacts (3 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_contacts` | List contacts | — |
| `create_contact` | Create contact | `name`, `position?`, `phone?`, `email?`, `sort_order?` |
| `update_contact` | Update contact | `id`, all fields optional |

### Carousel (3 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `list_carousel` | List carousel slides | — |
| `create_carousel_slide` | Create slide | `title`, `description?`, `link?`, `image?`, `sort_order?` |
| `update_carousel_slide` | Update slide | `id`, all fields optional |

### Introduction (2 tools, single record)
| Tool | Description | Key Params |
|------|-------------|------------|
| `get_introduction` | Get introduction | — |
| `update_introduction` | Update introduction | `title?`, `content?`, `content_format?` |

### Profiles (3 tools)
| Tool | Description | Key Params |
|------|-------------|------------|
| `get_my_profile` | Get current user's profile | — |
| `update_my_profile` | Update own profile | `display_name?`, `bio?`, `phone?`, `linkedin?`, `github?`, `website?` |
| `list_profiles` | List profiles (admin only) | `role?`, `limit?`, `offset?` |

### Images (1 tool)
| Tool | Description | Key Params |
|------|-------------|------------|
| `upload_image` | Upload image to Storage | `image` (base64), `filename`, `category` (announcement\|recruitment\|result\|event\|carousel\|organization) |

## Content Format

Tools that accept `content` support two formats via `content_format` param (default: `"markdown"`):

- **`markdown`** — AI-friendly. Server converts to Tiptap JSON before storing.
- **`tiptap`** — Raw Tiptap JSON for precise control.

### Markdown → Tiptap Conversion

```
Markdown → remark-parse (mdast) → custom transformer → Tiptap JSON
```

**Supported nodes:** heading, paragraph, bulletList, orderedList, listItem, codeBlock, blockquote, image, hardBreak
**Supported marks:** bold, italic, code, link, strike

### Image Upload

Images uploaded via `upload_image` go to Supabase Storage bucket `announcement-images` with path prefixes by category:
- `recruitment/`, `results/`, `events/`, `carousel/`, `organization/`, or root for announcements

Constraints: MIME type whitelist (jpeg, png, webp, gif), max 5MB.

## Project Structure

```
app/
├── .well-known/oauth-authorization-server/route.ts
├── oauth/
│   ├── authorize/page.tsx
│   ├── callback/route.ts
│   └── token/route.ts
├── mcp/route.ts
└── layout.tsx
lib/
├── auth/
│   ├── oauth-metadata.ts
│   ├── pkce.ts
│   └── auth-codes.ts          (Vercel KV)
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── types.ts
├── tools/
│   ├── announcements.ts
│   ├── results.ts
│   ├── recruitment.ts
│   ├── events.ts
│   ├── contacts.ts
│   ├── carousel.ts
│   ├── introduction.ts
│   ├── profiles.ts
│   └── images.ts
├── mcp-server.ts
└── markdown-to-tiptap.ts
```

## Tech Stack

| Dependency | Purpose |
|------------|---------|
| `next` | App Router framework |
| `@modelcontextprotocol/sdk` | MCP server + Streamable HTTP transport |
| `@supabase/supabase-js` | DB + Auth + Storage |
| `@vercel/kv` | Auth code store (TTL) |
| `unified` + `remark-parse` | Markdown parsing |
| `zod` | Tool parameter validation (MCP SDK native) |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # optional fallback
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## Security

1. **No delete operations** — by design
2. **RLS enforced** — every request uses the user's own JWT; permissions match the website
3. **PKCE required** — prevents auth code interception
4. **Auth codes are single-use** — stored in Vercel KV, TTL 5 min, deleted after exchange
5. **Image upload validation** — MIME type whitelist, 5MB limit
6. **Rate limiting** — deferred; rely on Vercel's built-in protection initially

## Error Handling

Unified tool response format:
```json
// Success
{ "content": [{ "type": "text", "text": "{\"success\":true,\"data\":{...}}" }] }

// Error
{ "content": [{ "type": "text", "text": "{\"success\":false,\"error\":\"...\"}" }], "isError": true }
```

| Scenario | Response |
|----------|----------|
| Token expired | HTTP 401 → client auto-refreshes |
| RLS denied | Tool error: "Permission denied" |
| Resource not found | Tool error: "Not found" |
| Validation failed | Zod error message |
| Markdown conversion failed | Tool error, nothing saved |
