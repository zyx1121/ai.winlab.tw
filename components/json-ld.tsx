type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  // Escape closing script tags to prevent XSS injection via user-controlled data.
  // The "\u003c" replacement ensures that any "<" character in the JSON
  // (e.g. from a title like "</script><script>alert(1)") cannot break
  // out of the <script> block. This is the standard mitigation used by
  // Next.js itself for inline JSON payloads.
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
