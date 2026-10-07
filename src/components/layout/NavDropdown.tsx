import { ChevronDown } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type NavGroup, isLeafActive } from '@/data/navigation';
import { useDismiss } from '@/lib/hooks';

export function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  const active = group.items.some((item) => isLeafActive(item, pathname));

  return (
    <li ref={rootRef} className="nav__item">
      <button
        type="button"
        className="nav__link nav__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={active || undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {group.label}
        <ChevronDown size={16} aria-hidden="true" className="nav__chevron" />
      </button>
      <ul id={panelId} className="nav__panel" hidden={!open}>
        {group.items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="nav__panel-link"
              aria-current={isLeafActive(item, pathname) ? 'page' : undefined}
              onClick={close}
            >
              <span>{item.label}</span>
              {item.hint && <small>{item.hint}</small>}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
