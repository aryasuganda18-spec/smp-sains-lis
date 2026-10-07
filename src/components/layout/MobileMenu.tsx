import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { ButtonLink } from '@/components/ui/Button';
import { ADMISSION_LINK, NAV, isLeafActive, isNavGroup } from '@/data/navigation';
import { Brand } from './Brand';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  return (
    <ModalDialog open={open} onClose={onClose} label="Menu navigasi" className="sheet on-dark">
      <div className="sheet__head">
        <Brand onNavigate={onClose} />
        <button type="button" className="icon-button" onClick={onClose} aria-label="Tutup menu">
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Menu utama" className="sheet__nav">
        {NAV.map((entry) =>
          isNavGroup(entry) ? (
            <section key={entry.label} className="sheet__group" aria-label={entry.label}>
              <h2 className="sheet__heading">{entry.label}</h2>
              <ul>
                {entry.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="sheet__link"
                      aria-current={isLeafActive(item, pathname) ? 'page' : undefined}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <Link
              key={entry.to}
              to={entry.to}
              className="sheet__link sheet__link--top"
              aria-current={isLeafActive(entry, pathname) ? 'page' : undefined}
              onClick={onClose}
            >
              {entry.label}
            </Link>
          ),
        )}
      </nav>
      <ButtonLink to={ADMISSION_LINK.to} variant="gold" size="lg" block onClick={onClose}>
        {ADMISSION_LINK.label}
      </ButtonLink>
    </ModalDialog>
  );
}
