import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { ButtonLink } from '@/components/ui/Button';
import { NotFound } from './NotFound';

export function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

  return (
    <section className="section section--center">
      <div className="container">
        <h1>Terjadi kesalahan</h1>
        <p className="lead">Halaman ini gagal ditampilkan. Muat ulang halaman, atau kembali ke beranda.</p>
        <ButtonLink to={ROUTES.home} variant="primary" size="lg">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </section>
  );
}
