import type { ReactNode } from "react";

interface LongFormPageProps {
  title: string;
  /** e.g. "Last updated 3 Oct 2026" */
  meta?: string;
  notice?: ReactNode;
  children: ReactNode;
}

/** Layout for long text pages such as the privacy policy and terms (720px column). */
export function LongFormPage({
  title,
  meta,
  notice,
  children,
}: LongFormPageProps) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 lg:py-14">
      <h1 className="text-h1">{title}</h1>
      {meta && <p className="mt-2 text-small text-fg-muted">{meta}</p>}
      {notice && <div className="mt-6">{notice}</div>}
      <div className="mt-6 text-body-lg [&_a]:text-primary [&_a]:underline [&_h2]:mt-10 [&_h2]:text-h2 [&_h3]:mt-6 [&_h3]:text-h3 [&_li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
