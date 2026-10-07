import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PhotoGrid } from '@/features/gallery/PhotoGrid';
import { PHOTOS, toGridPhoto } from '@/data/photos';

const PREVIEW = [PHOTOS.lab, PHOTOS.classroom, PHOTOS.library, PHOTOS.robotics];

export function CampusSection() {
  return (
    <section className="section section--sand" aria-labelledby="kampus-title">
      <div className="container">
        <header className="section__head section__head--row">
          <h2 id="kampus-title">Sekilas kampus</h2>
          <Link to={ROUTES.gallery} className="link-arrow">
            Lihat semua galeri <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <PhotoGrid photos={PREVIEW.map((photo) => toGridPhoto(photo.caption, photo))} />
      </div>
    </section>
  );
}
