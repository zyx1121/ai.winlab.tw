import assert from "node:assert/strict"
import { describe, test } from "node:test"

import { isImageFile, isWithinSizeLimit } from "@/lib/upload-image"

function fakeFile(type: string, size: number): File {
  const blob = new Blob(["x".repeat(Math.min(size, 100))], { type })
  Object.defineProperty(blob, "size", { value: size })
  Object.defineProperty(blob, "name", { value: "test.jpg" })
  return blob as File
}

describe("isImageFile", () => {
  test("accepts JPEG", () => {
    assert.equal(isImageFile(fakeFile("image/jpeg", 100)), true)
  })

  test("accepts PNG", () => {
    assert.equal(isImageFile(fakeFile("image/png", 100)), true)
  })

  test("accepts GIF", () => {
    assert.equal(isImageFile(fakeFile("image/gif", 100)), true)
  })

  test("accepts WebP", () => {
    assert.equal(isImageFile(fakeFile("image/webp", 100)), true)
  })

  test("rejects PDF", () => {
    assert.equal(isImageFile(fakeFile("application/pdf", 100)), false)
  })

  test("rejects SVG", () => {
    assert.equal(isImageFile(fakeFile("image/svg+xml", 100)), false)
  })
})

describe("isWithinSizeLimit", () => {
  test("accepts files under 5MB", () => {
    assert.equal(isWithinSizeLimit(fakeFile("image/png", 1024)), true)
  })

  test("accepts files exactly at 5MB", () => {
    assert.equal(isWithinSizeLimit(fakeFile("image/png", 5 * 1024 * 1024)), true)
  })

  test("rejects files over 5MB", () => {
    assert.equal(isWithinSizeLimit(fakeFile("image/png", 5 * 1024 * 1024 + 1)), false)
  })
})
