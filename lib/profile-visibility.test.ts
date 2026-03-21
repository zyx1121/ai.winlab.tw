import assert from "node:assert/strict"
import { describe, test } from "node:test"

import { getVisibleProfileForViewer } from "@/lib/profile-visibility"
import type { Profile } from "@/lib/supabase/types"

const profileFixture: Profile = {
  id: "user_1",
  created_at: "2026-03-21T00:00:00.000Z",
  updated_at: "2026-03-21T00:00:00.000Z",
  display_name: "王小明",
  avatar_url: "https://example.com/avatar.png",
  role: "user",
  phone: "0912345678",
  bio: "這是自我介紹",
  linkedin: "https://linkedin.com/in/example",
  facebook: "https://facebook.com/example",
  github: "https://github.com/example",
  website: "https://example.com",
  resume: "https://example.com/resume.pdf",
  social_links: ["https://blog.example.com"],
}

describe("profile visibility", () => {
  test("signed-out viewers only receive the public profile name", () => {
    const visible = getVisibleProfileForViewer(profileFixture, false)

    assert.equal(visible.display_name, "王小明")
    assert.equal(visible.avatar_url, null)
    assert.equal(visible.bio, null)
    assert.equal(visible.phone, null)
    assert.equal(visible.linkedin, null)
    assert.equal(visible.facebook, null)
    assert.equal(visible.github, null)
    assert.equal(visible.website, null)
    assert.equal(visible.resume, null)
    assert.deepEqual(visible.social_links, [])
  })

  test("signed-in viewers receive the full profile", () => {
    const visible = getVisibleProfileForViewer(profileFixture, true)

    assert.deepEqual(visible, profileFixture)
  })
})
