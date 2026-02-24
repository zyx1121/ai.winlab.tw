/**
 * Shared layout for introduction content: used by read-only page and edit preview.
 * Matches announcement/result layout: max-w-6xl, title (with optional actions), then prose.
 */

import type { ReactNode } from "react";

type Props = {
  title: string;
  contentHtml: string;
  /** Optional slot rendered next to the title (e.g. Edit button on read-only page) */
  actions?: ReactNode;
};

export function IntroductionDetail({ title, contentHtml, actions }: Props) {
  return (
    <>
      <div className="max-w-6xl mb-8 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>
        {actions}
      </div>

      <div className="max-w-6xl">
        {contentHtml ? (
          <div
            className="prose prose-sm sm:prose-base max-w-none [&_img]:pt-4"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <p className="text-muted-foreground">（無內容）</p>
        )}
      </div>
    </>
  );
}
