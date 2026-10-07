import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/app/routes';
import { AsyncView } from '@/components/ui/AsyncView';
import { useDocumentMeta } from '@/lib/hooks';
import { type DashboardCounts, fetchDashboardCounts } from '../api';

interface StatCard {
  label: string;
  value: (counts: DashboardCounts) => string;
  to: string;
}

const STATS: readonly StatCard[] = [
  { label: 'Pendaftar baru', value: (c) => String(c.newRegistrations), to: ADMIN_ROUTES.registrations },
  { label: 'Total pendaftar', value: (c) => String(c.registrations), to: ADMIN_ROUTES.registrations },
  { label: 'Artikel terbit', value: (c) => `${c.publishedArticles} dari ${c.articles}`, to: ADMIN_ROUTES.articles },
  { label: 'Album · foto', value: (c) => `${c.albums} · ${c.photos}`, to: ADMIN_ROUTES.albums },
  { label: 'Video', value: (c) => String(c.videos), to: ADMIN_ROUTES.videos },
  { label: 'Pengumuman', value: (c) => String(c.announcements), to: ADMIN_ROUTES.announcements },
];

export function Dashboard() {
  useDocumentMeta('Ringkasan admin');
  const query = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: fetchDashboardCounts });

  return (
    <>
      <h1 className="admin__title">Ringkasan</h1>
      <AsyncView query={query}>
        {(counts) => (
          <ul className="stat-grid">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <Link to={stat.to} className="stat">
                  <span className="stat__value">{stat.value(counts)}</span>
                  <span className="stat__label">{stat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AsyncView>
    </>
  );
}
