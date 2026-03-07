# Profile Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign `/profile/[id]` to a Medium-style author page with a two-column responsive layout and inline editing.

**Architecture:** Single file rewrite of `app/profile/[id]/client.tsx`. Left sticky sidebar shows profile info; right column shows results list in Medium article-row style. Edit mode is toggled by the owner via a button — when active, clicking any field replaces it with an inline input that auto-saves on blur.

**Tech Stack:** Next.js 14 App Router, React, Tailwind CSS v4, shadcn/ui (Separator, Button), Supabase client, lucide-react icons.

---

### Task 1: Layout shell — two-column responsive grid

**Files:**
- Modify: `app/profile/[id]/client.tsx` (full rewrite)

Replace the entire file with the new skeleton. Keep all existing state/logic intact — just change the JSX structure.

**Step 1: Replace the outer layout wrapper**

The current outer div is `max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8`.

Replace the entire return value (view mode only — keep edit mode card exactly as-is for now) with:

```tsx
return (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <div className="flex flex-col md:flex-row md:gap-16">
      {/* LEFT COLUMN */}
      <aside className="md:w-72 shrink-0 md:sticky md:top-20 md:self-start mb-10 md:mb-0">
        {/* profile content — Task 2 */}
      </aside>

      {/* RIGHT COLUMN */}
      <main className="flex-1 min-w-0">
        {/* results list — Task 3 */}
      </main>
    </div>
  </div>
);
```

Keep the `isEditMode && isOwner` branch above this — it renders the edit Card (unchanged for now).

**Step 2: Verify in browser**

Run `bun dev`, navigate to `/profile/578d93f5-e691-4584-b70c-c721e28def13`.
Expected: page renders, two-column on wide screen, single column on narrow.

**Step 3: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile page — two-column responsive shell"
```

---

### Task 2: Left column — profile view mode

**Files:**
- Modify: `app/profile/[id]/client.tsx`

Replace the `{/* profile content — Task 2 */}` placeholder with the full left column.

**Step 1: Add the left column JSX**

```tsx
{/* Edit toggle — owner only */}
{isOwner && (
  <div className="flex justify-end mb-4">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsEditMode((v) => !v)}
      className="text-muted-foreground hover:text-foreground"
    >
      {isEditMode ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Pencil className="w-4 h-4 mr-1.5" />}
      {isEditMode ? "完成編輯" : "編輯資料"}
    </Button>
  </div>
)}

{/* Avatar */}
<div className="flex flex-col items-center gap-4 mb-6">
  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
    {profile.avatar_url ? (
      <img
        src={profile.avatar_url}
        alt={displayNameValue}
        className="w-full h-full object-cover"
      />
    ) : (
      <User className="w-12 h-12 text-muted-foreground" />
    )}
  </div>

  {/* Name */}
  <div className="text-center">
    <h1 className="text-2xl font-bold">{displayNameValue}</h1>
    <p className="text-sm text-muted-foreground mt-1">
      {results.filter((r) => r.status === "published").length} 篇個人成果
    </p>
  </div>
</div>

{/* Bio */}
{profile.bio && (
  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap mb-5">
    {profile.bio}
  </p>
)}
{!profile.bio && !isEditMode && (
  <p className="text-sm text-muted-foreground mb-5">尚未填寫自我介紹</p>
)}

{/* Social link icons */}
{structuredLinks.length > 0 && (
  <div className="flex flex-wrap gap-3 mb-4">
    {structuredLinks.map(({ key, href, icon: Icon }) => (
      <a
        key={key}
        href={href!}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={key}
      >
        <Icon className="w-5 h-5" />
      </a>
    ))}
  </div>
)}

{/* Extra links */}
{extraLinks.length > 0 && (
  <div className="flex flex-col gap-1">
    {extraLinks.map((url: string, i: number) => (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary underline underline-offset-2 truncate hover:opacity-80"
      >
        {url}
      </a>
    ))}
  </div>
)}
```

You'll need to add `Pencil` to the lucide-react imports. Remove the old `Eye` import (no longer used this way — `EyeOff` stays).

**Step 2: Verify in browser**

Expected: large centered avatar, name, bio, icon links displayed on left column. Edit toggle button visible when logged in as owner.

**Step 3: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile left column — avatar, bio, social links"
```

---

### Task 3: Right column — results list (Medium style)

**Files:**
- Modify: `app/profile/[id]/client.tsx`

Replace the `{/* results list — Task 3 */}` placeholder.

**Step 1: Add results list JSX**

```tsx
{/* Header */}
<div className="flex items-center justify-between mb-6">
  <h2 className="text-lg font-semibold">個人成果</h2>
  {isOwner && (
    <Link
      href={`/events`}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Plus className="w-4 h-4" />
      新增成果
    </Link>
  )}
</div>

{/* List */}
{results.length === 0 ? (
  <p className="text-sm text-muted-foreground py-12 text-center">尚無成果紀錄</p>
) : (
  <div className="flex flex-col divide-y divide-border">
    {results.map((result) => (
      <Link
        key={result.id}
        href={isOwner ? `/result/${result.id}/edit` : `/result/${result.id}`}
        className="py-6 flex items-start justify-between gap-6 group"
      >
        {/* Text content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{result.date}</span>
            {(isOwner || result.status === "draft") && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  result.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {result.status === "published" ? "已發布" : "草稿"}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold line-clamp-2 group-hover:underline underline-offset-2">
            {result.title || "(無標題)"}
          </h3>
          {result.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {result.summary}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        {result.header_image && result.header_image !== "/placeholder.png" && (
          <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image
              src={result.header_image}
              alt={result.title}
              fill
              className="object-cover"
              unoptimized={isExternalImage(result.header_image)}
            />
          </div>
        )}
      </Link>
    ))}
  </div>
)}
```

Note: `Plus` is already imported. The "新增成果" link goes to `/events` (the events listing page where users can find their event and add results from there — no dedicated standalone create page exists).

**Step 2: Verify in browser**

Expected: results appear as Medium-style rows with title, summary on left, thumbnail on right, separated by horizontal lines. Draft badges visible to owner.

**Step 3: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile right column — Medium-style results list"
```

---

### Task 4: Inline edit — text fields (name and bio)

**Files:**
- Modify: `app/profile/[id]/client.tsx`

Now wire up `isEditMode` to the left column so clicking name/bio replaces them with inputs.

**Step 1: Add saving state per field**

Add near the top of the component, alongside existing state:

```tsx
const [savingField, setSavingField] = useState<string | null>(null);
```

**Step 2: Add auto-save helper**

```tsx
const saveField = async (field: string, value: string | null) => {
  if (!user) return;
  setSavingField(field);
  const supabase = createClient();
  await supabase
    .from("profiles")
    .update({ [field]: value || null })
    .eq("id", user.id);
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, bio, phone, linkedin, facebook, github, website, resume, social_links")
    .eq("id", user.id)
    .single();
  if (data) {
    setProfile(data as Profile);
    await refreshProfile();
  }
  setSavingField(null);
};
```

**Step 3: Replace the name display in the left column**

```tsx
{/* Name — inline editable */}
{isEditMode ? (
  <div className="relative">
    <input
      value={displayName}
      onChange={(e) => setDisplayName(e.target.value)}
      onBlur={() => saveField("display_name", displayName)}
      className="text-2xl font-bold text-center bg-transparent border-b border-border focus:border-foreground outline-none w-full pb-0.5"
      placeholder="請輸入姓名"
    />
    {savingField === "display_name" && (
      <Loader2 className="w-3 h-3 animate-spin absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
    )}
  </div>
) : (
  <h1 className="text-2xl font-bold">{displayNameValue}</h1>
)}
```

**Step 4: Replace the bio display**

```tsx
{/* Bio — inline editable */}
{isEditMode ? (
  <div className="relative mb-5">
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      onBlur={() => saveField("bio", bio)}
      rows={4}
      className="w-full text-sm leading-relaxed bg-transparent border-b border-border focus:border-foreground outline-none resize-none pb-0.5"
      placeholder="簡單介紹一下自己..."
    />
    {savingField === "bio" && (
      <Loader2 className="w-3 h-3 animate-spin absolute right-0 top-0 text-muted-foreground" />
    )}
  </div>
) : profile.bio ? (
  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap mb-5">
    {profile.bio}
  </p>
) : (
  <p className="text-sm text-muted-foreground mb-5">尚未填寫自我介紹</p>
)}
```

**Step 5: Remove the old `isEditMode && isOwner` Card branch**

The old Card-based edit mode (the `if (isEditMode && isOwner) return <Card>...` block) is now replaced by inline editing. Delete that entire branch, and delete the old `handleSaveProfile` function as well as the now-unused Card imports (CardDescription, CardTitle, CardHeader, CardContent).

Keep: `Card` from shadcn may still be imported but unused — remove from import.

Also remove: `Eye` icon import (replaced by `EyeOff` toggle), `Label`, `Input`, `Textarea`, `Separator` (unless used in Task 6).

**Step 6: Verify**

Toggle edit mode → name and bio become underline inputs. Edit name → blur → spinner → saved. Refresh page → new name shows.

**Step 7: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile inline edit — name and bio auto-save on blur"
```

---

### Task 5: Inline edit — social link fields

**Files:**
- Modify: `app/profile/[id]/client.tsx`

Replace the social link icons section with an editable version in edit mode.

**Step 1: Define the social fields config**

This already exists in the component as `structuredLinks`. Reuse it for edit mode too. Add a parallel config for editing:

```tsx
const socialFields = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, value: linkedin, setter: setLinkedin },
  { key: "facebook", label: "Facebook", icon: Facebook, value: facebook, setter: setFacebook },
  { key: "github", label: "GitHub", icon: Github, value: github, setter: setGithub },
  { key: "website", label: "個人網站", icon: Globe, value: website, setter: setWebsite },
  { key: "resume", label: "履歷連結", icon: FileText, value: resume, setter: setResume },
] as const;
```

Place this inside the component body, before the return.

**Step 2: Replace the social links section in the left column**

```tsx
{/* Social links */}
{isEditMode ? (
  <div className="flex flex-col gap-2 mb-4">
    {socialFields.map(({ key, label, icon: Icon, value, setter }) => (
      <div key={key} className="flex items-center gap-2">
        <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => setter(e.target.value)}
            onBlur={() => saveField(key, value)}
            placeholder={`${label} 網址`}
            className="w-full text-sm bg-transparent border-b border-border focus:border-foreground outline-none pb-0.5 pr-5"
          />
          {savingField === key && (
            <Loader2 className="w-3 h-3 animate-spin absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
      </div>
    ))}
  </div>
) : structuredLinks.length > 0 ? (
  <div className="flex flex-wrap gap-3 mb-4">
    {structuredLinks.map(({ key, href, icon: Icon }) => (
      <a
        key={key}
        href={href!}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={key}
      >
        <Icon className="w-5 h-5" />
      </a>
    ))}
  </div>
) : null}
```

Note: `saveField` handles `social_links` array separately (next task). For these individual URL fields, the existing `saveField(key, value)` pattern works because the DB column names match the field keys exactly.

**Step 3: Verify**

In edit mode, each social link shows as a labelled icon + URL input. Blur saves. In view mode, icons appear as before.

**Step 4: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile inline edit — social link fields"
```

---

### Task 6: Inline edit — extra links

**Files:**
- Modify: `app/profile/[id]/client.tsx`

Extra links (`social_links` JSON array) need a separate save helper since they're an array, not individual strings.

**Step 1: Add array save helper**

```tsx
const saveExtraLinks = async (links: string[]) => {
  if (!user) return;
  setSavingField("social_links");
  const supabase = createClient();
  const filtered = links.filter((l) => l.trim() !== "");
  await supabase
    .from("profiles")
    .update({ social_links: filtered })
    .eq("id", user.id);
  setSocialLinks(filtered);
  setSavingField(null);
};
```

**Step 2: Replace extra links section**

```tsx
{/* Extra links */}
{isEditMode ? (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Link2 className="w-3.5 h-3.5" />
        額外連結
        {savingField === "social_links" && (
          <Loader2 className="w-3 h-3 animate-spin ml-1 text-muted-foreground" />
        )}
      </span>
      <button
        type="button"
        onClick={addSocialLink}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
      >
        <Plus className="w-3 h-3" />
        新增
      </button>
    </div>
    {socialLinks.map((link, idx) => (
      <div key={idx} className="flex items-center gap-1.5">
        <input
          value={link}
          onChange={(e) => updateSocialLink(idx, e.target.value)}
          onBlur={() => saveExtraLinks(socialLinks)}
          placeholder="https://..."
          className="flex-1 text-sm bg-transparent border-b border-border focus:border-foreground outline-none pb-0.5"
        />
        <button
          type="button"
          onClick={() => {
            const next = socialLinks.filter((_, i) => i !== idx);
            setSocialLinks(next);
            saveExtraLinks(next);
          }}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    ))}
    {socialLinks.length === 0 && (
      <p className="text-xs text-muted-foreground">尚未新增</p>
    )}
  </div>
) : extraLinks.length > 0 ? (
  <div className="flex flex-col gap-1">
    {extraLinks.map((url: string, i: number) => (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary underline underline-offset-2 truncate hover:opacity-80"
      >
        {url}
      </a>
    ))}
  </div>
) : null}
```

**Step 3: Clean up unused imports**

After all tasks are complete, remove any unused imports:
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` (if removed in Task 4)
- `Label`, `Input`, `Textarea`, `Separator` (replaced by native inputs)
- `Eye` (replaced by the toggle pattern using `EyeOff`)
- `Trophy` (no longer shown as section header icon — optional, can keep)

Run `bun lint` and fix any warnings.

**Step 4: Verify full flow**

1. Visit profile as visitor: two columns, avatar, bio, icons, results list
2. Login as owner: "編輯資料" button appears
3. Click edit: fields become inline inputs
4. Edit name → blur → saves → refresh confirms change
5. Edit bio → blur → saves
6. Edit a social link → blur → saves
7. Add extra link → blur → saves
8. Click "完成編輯" → back to view mode

**Step 5: Commit**

```bash
git add app/profile/[id]/client.tsx
git commit -m "feat: profile inline edit — extra links + cleanup"
```
