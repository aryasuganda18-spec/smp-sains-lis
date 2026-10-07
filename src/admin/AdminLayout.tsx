import { ExternalLink, FileText, GalleryHorizontal, LayoutDashboard, LogOut, Megaphone, Users, Video } from 'lucide-react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ADMIN_ROUTES, ROUTES } from '@/app/routes';
import { LoadingBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { SCHOOL } from '@/data/site';
import { useAuth } from './authContext';

const ADMIN_NAV = [
  { to: ADMIN_ROUTES.dashboard, label: 'Ringkasan', icon: LayoutDashboard, end: true },
  { to: ADMIN_ROUTES.articles, label: 'Artikel', icon: FileText },
  { to: ADMIN_ROUTES.albums, label: 'Galeri', icon: GalleryHorizontal },
  { to: ADMIN_ROUTES.videos, label: 'Video', icon: Video },
  { to: ADMIN_ROUTES.announcements, label: 'Pengumuman', icon: Megaphone },
  { to: ADMIN_ROUTES.registrations, label: 'Pendaftar', icon: Users },
] as const;

export function RequireAdmin() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <LoadingBlock label="Memeriksa akses…" />;
  if (status === 'signed-out') return <Navigate to={ADMIN_ROUTES.login} replace state={{ from: location.pathname }} />;
  if (status === 'forbidden') return <Navigate to={ADMIN_ROUTES.login} replace />;
  return <AdminLayout />;
}

function AdminLayout() {
  const { email, signOut } = useAuth();

  return (
    <div className="admin">
      <header className="admin__bar">
        <p className="admin__brand">{SCHOOL.shortName} · Admin</p>
        <div className="admin__bar-actions">
          <a href={ROUTES.home} className="admin__link" target="_blank" rel="noopener noreferrer">
            Lihat situs <ExternalLink size={16} aria-hidden="true" />
          </a>
          <span className="admin__email">{email}</span>
          <Button variant="outline" size="sm" icon={LogOut} onClick={() => void signOut()}>
            Keluar
          </Button>
        </div>
      </header>
      <nav className="admin__nav" aria-label="Menu admin">
        {ADMIN_NAV.map(({ to, label, icon: Icon, ...rest }) => (
          <NavLink key={to} to={to} className="admin__nav-link" {...rest}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="admin__main" id="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
