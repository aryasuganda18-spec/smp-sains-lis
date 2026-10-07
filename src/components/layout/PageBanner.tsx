import type { ReactNode } from 'react';

interface PageBannerProps {
  title: string;
  lead?: string;
  children?: ReactNode;
}

export function PageBanner({ title, lead, children }: PageBannerProps) {
  return (
    <section className="banner on-dark">
      <div className="container banner__inner">
        <h1>{title}</h1>
        {lead && <p className="banner__lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
