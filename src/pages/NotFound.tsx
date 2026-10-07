import { ROUTES } from '@/app/routes';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentMeta } from '@/lib/hooks';

export function NotFound() {
  useDocumentMeta('Halaman tidak ditemukan');
  return (
    <section className="section section--center not-found">
      <div className="container">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>Halaman tidak ditemukan</h1>
        <p className="lead">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
        <ButtonLink to={ROUTES.home} variant="primary" size="lg">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </section>
  );
}
