import { useEffect, useRef } from 'react';
import { type Location, Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { StickyCta } from './StickyCta';

function useFocusMainOnNavigate() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);
}

const scrollKey = ({ key, hash }: Location) => (hash ? `${key}${hash}` : key);

export function PublicLayout() {
  useFocusMainOnNavigate();
  const navigating = useNavigation().state === 'loading';

  return (
    <>
      <a href="#main" className="skip-link">
        Lewati ke konten utama
      </a>
      <div className="progress" data-active={navigating || undefined} aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <StickyCta />
      <ScrollRestoration getKey={scrollKey} />
    </>
  );
}
