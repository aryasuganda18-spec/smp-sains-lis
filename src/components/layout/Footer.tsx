import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/app/routes';
import { FOOTER_COLUMNS } from '@/data/navigation';
import { CONTACT, MAPS_URL, SCHOOL, WHATSAPP_MESSAGES } from '@/data/site';
import { whatsAppLink } from '@/lib/whatsapp';
import { Brand } from './Brand';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="container footer__grid">
        <div className="footer__about">
          <Brand />
          <p>{SCHOOL.tagline}.</p>
          <SocialLinks className="footer__social" />
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="footer__col">
            <h2 className="footer__heading">{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer__col">
          <h2 className="footer__heading">Hubungi kami</h2>
          <ul className="footer__contact">
            <li>
              <MapPin size={18} aria-hidden="true" />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {CONTACT.address}
              </a>
            </li>
            <li>
              <MessageCircle size={18} aria-hidden="true" />
              <a href={whatsAppLink(CONTACT.whatsappId, WHATSAPP_MESSAGES.inquiry)} target="_blank" rel="noopener noreferrer">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <Mail size={18} aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__legal">
        <p>
          © {new Date().getFullYear()} {SCHOOL.name}
        </p>
        <Link to={ADMIN_ROUTES.login}>Masuk admin</Link>
      </div>
    </footer>
  );
}
