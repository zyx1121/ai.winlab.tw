import { NextResponse } from "next/server";

/**
 * Validate that `next` is a safe relative path (starts with "/" and does not
 * contain protocol-relative patterns like "//evil.com" or backslash tricks).
 */
function safePath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  return raw;
}

// Pass-through: Supabase redirects here after verifying the email token.
// We forward to the target page so the browser-side Supabase client
// (which holds the PKCE code_verifier) can complete the exchange.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safePath(searchParams.get("next"));
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}${next}?error=${encodeURIComponent(error)}`);
  }
  if (code) {
    return NextResponse.redirect(`${origin}${next}?code=${encodeURIComponent(code)}`);
  }
  return NextResponse.redirect(`${origin}${next}?error=invalid`);
}
