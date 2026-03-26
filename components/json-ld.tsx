type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  // Escape "<" to prevent XSS via user-controlled fields (e.g. titles
  // containing "</script>"). This is the standard mitigation Next.js
  // uses for inline JSON payloads.
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
