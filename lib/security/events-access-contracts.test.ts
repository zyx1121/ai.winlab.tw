import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, test } from "node:test"

const eventsPage = readFileSync(resolve(process.cwd(), "app/events/page.tsx"), "utf8")
const eventDetailPage = readFileSync(resolve(process.cwd(), "app/events/[slug]/page.tsx"), "utf8")

describe("events access contracts", () => {
  test("events index restricts drafts to admins", () => {
    assert.ok(eventsPage.includes("if (!isAdmin)"))
    assert.ok(eventsPage.includes('query.eq("status", "published")'))
    assert.ok(!eventsPage.includes("if (!user) query.eq"))
  })

  test("event detail restricts event draft visibility to admins", () => {
    assert.ok(eventDetailPage.includes("if (!isAdmin) eventQuery.eq"))
    assert.ok(eventDetailPage.includes('eventQuery.eq("status", "published")'))
    assert.ok(!eventDetailPage.includes("if (!user) eventQuery.eq"))
  })
})
