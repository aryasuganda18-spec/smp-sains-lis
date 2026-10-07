import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFound } from '@/pages/NotFound';
import './admin.css';
import { RequireAdmin } from './AdminLayout';
import { AuthProvider } from './auth';
import { Albums } from './pages/Albums';
import { AlbumDetail } from './pages/AlbumDetail';
import { Announcements } from './pages/Announcements';
import { ArticleEditor } from './pages/ArticleEditor';
import { Articles } from './pages/Articles';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Registrations } from './pages/Registrations';
import { Videos } from './pages/Videos';
import { ToastProvider } from './toast';

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.append(meta);
    return () => meta.remove();
  }, []);
}

export function AdminApp() {
  useNoIndex();

  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="masuk" element={<Login />} />
          <Route element={<RequireAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="artikel" element={<Articles />} />
            <Route path="artikel/baru" element={<ArticleEditor />} />
            <Route path="artikel/:id" element={<ArticleEditor />} />
            <Route path="galeri" element={<Albums />} />
            <Route path="galeri/:albumId" element={<AlbumDetail />} />
            <Route path="video" element={<Videos />} />
            <Route path="pengumuman" element={<Announcements />} />
            <Route path="pendaftar" element={<Registrations />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
