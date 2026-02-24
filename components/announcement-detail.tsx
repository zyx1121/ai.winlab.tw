/**
 * Shared layout for announcement content: used by published detail page and edit preview.
 * Matches result page layout: no card padding, title first, then date + category (instrumentSerif), separator, prose.
 */

type Props = {
  title: string;
  date: string;
  category: string;
  contentHtml: string;
};

const instrumentSerifStyle = { fontFamily: "var(--font-instrument-serif)" };

export function AnnouncementDetail({ title, date, category, contentHtml }: Props) {
  return (
    <>
      <div className="max-w-6xl mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance mb-4">
          {title}
        </h1>
        <div
          className="flex items-center gap-2 text-base text-muted-foreground flex-wrap"
          style={instrumentSerifStyle}
        >
          <span>{date}</span>
          <span className="opacity-30" aria-hidden>
            ·
          </span>
          <span className="px-2 py-0.5 bg-muted rounded text-sm font-medium">
            {category}
          </span>
        </div>
      </div>

      <hr className="mb-8" />

      <div className="max-w-6xl">
        <div
          className="prose prose-sm sm:prose-base max-w-none [&_img]:pt-4"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </>
  );
}
