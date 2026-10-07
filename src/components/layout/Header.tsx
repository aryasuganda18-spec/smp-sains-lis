import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { ADMISSION_LINK, NAV, isLeafActive, isNavGroup } from '@/data/navigation';
import { ROUTES } from '@/app/routes';
import { useScrolled } from '@/lib/hooks';
import { Brand } from './Brand';
import { MobileMenu } from './MobileMenu';
import { NavDropdown } from './NavDropdown';

export function Header() {
  const { pathname } = useLocation();
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlay = pathname === ROUTES.home && !scrolled;

  return (
    <header className="header on-dark" data-overlay={overlay || undefined}>
      <div className="container header__bar">
        <Brand />
        <nav aria-label="Navigasi utama" className="nav">
          <ul className="nav__list">
            {NAV.map((entry) =>
              isNavGroup(entry) ? (
                <NavDropdown key={entry.label} group={entry} pathname={pathname} />
              ) : (
                <li key={entry.to} className="nav__item">
                  <Link
                    to={entry.to}
                    className="nav__link"
                    aria-current={isLeafActive(entry, pathname) ? 'page' : undefined}
                  >
                    {entry.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="header__actions">
          <ButtonLink to={ADMISSION_LINK.to} variant="gold" size="sm" className="header__cta">
            {ADMISSION_LINK.label}
          </ButtonLink>
          <button
            type="button"
            className="icon-button header__menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
            aria-haspopup="dialog"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </header>
  );
}
