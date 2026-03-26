import assert from "node:assert/strict"
import { describe, test } from "node:test"

import {
  cn,
  resolveImageSrc,
  hasCustomImage,
  isExternalImage,
  IMAGE_PLACEHOLDER_DATA_URL,
} from "@/lib/utils"

const LEGACY_PLACEHOLDER = ["", "placeholder.png"].join("/")

describe("cn", () => {
  test("merges class names", () => {
    assert.equal(cn("px-2", "py-1"), "px-2 py-1")
  })

  test("deduplicates conflicting tailwind classes", () => {
    assert.equal(cn("px-2", "px-4"), "px-4")
  })

  test("handles conditional classes", () => {
    assert.equal(cn("base", false && "hidden", "visible"), "base visible")
  })
})

describe("resolveImageSrc", () => {
  test("returns placeholder for null", () => {
    assert.equal(resolveImageSrc(null), IMAGE_PLACEHOLDER_DATA_URL)
  })

  test("returns placeholder for undefined", () => {
    assert.equal(resolveImageSrc(undefined), IMAGE_PLACEHOLDER_DATA_URL)
  })

  test("returns placeholder for legacy placeholder path", () => {
    assert.equal(resolveImageSrc(LEGACY_PLACEHOLDER), IMAGE_PLACEHOLDER_DATA_URL)
  })

  test("returns the src for a real URL", () => {
    assert.equal(resolveImageSrc("https://example.com/img.jpg"), "https://example.com/img.jpg")
  })
})

describe("hasCustomImage", () => {
  test("returns false for null", () => {
    assert.equal(hasCustomImage(null), false)
  })

  test("returns false for legacy placeholder path", () => {
    assert.equal(hasCustomImage(LEGACY_PLACEHOLDER), false)
  })

  test("returns false for data URL placeholder", () => {
    assert.equal(hasCustomImage(IMAGE_PLACEHOLDER_DATA_URL), false)
  })

  test("returns true for a custom URL", () => {
    assert.equal(hasCustomImage("https://example.com/photo.jpg"), true)
  })
})

describe("isExternalImage", () => {
  test("returns true for https URLs", () => {
    assert.equal(isExternalImage("https://example.com/img.jpg"), true)
  })

  test("returns true for http URLs", () => {
    assert.equal(isExternalImage("http://example.com/img.jpg"), true)
  })

  test("returns false for relative paths", () => {
    assert.equal(isExternalImage("/images/local.jpg"), false)
  })

  test("returns false for null", () => {
    assert.equal(isExternalImage(null), false)
  })
})
