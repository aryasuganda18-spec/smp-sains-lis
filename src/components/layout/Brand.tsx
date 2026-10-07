import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { SCHOOL } from '@/data/site';
import { LOGO_URL } from '@/data/photos';

export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to={ROUTES.home} className="brand" onClick={onNavigate} aria-label={`${SCHOOL.name}, ke beranda`}>
      <img src={LOGO_URL} alt="" width={40} height={40} className="brand__logo" />
      <span className="brand__text">
        <span className="brand__name">{SCHOOL.shortName}</span>
        <span className="brand__suffix">{SCHOOL.suffix}</span>
      </span>
    </Link>
  );
}
