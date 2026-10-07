import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HOME_SECTIONS, ROUTES, homeSectionPath } from '@/app/routes';
import { ButtonLink } from '@/components/ui/Button';
import { PPDB } from '@/data/site';

export function StickyCta() {
  const { pathname } = useLocation();
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const form = document.getElementById(HOME_SECTIONS.form);
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry?.isIntersecting ?? false));
    observer.observe(form);
    return () => observer.disconnect();
  }, [pathname]);

  const hidden = pathname === ROUTES.home && formInView;

  return (
    <div className="sticky-cta" data-hidden={hidden || undefined}>
      <ButtonLink to={homeSectionPath(HOME_SECTIONS.form)} variant="gold" size="lg" block>
        Daftar PPDB {PPDB.academicYear}
      </ButtonLink>
    </div>
  );
}
