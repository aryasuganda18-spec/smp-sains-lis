import { HOME_SECTIONS, homeSectionPath } from '@/app/routes';
import { ButtonLink } from '@/components/ui/Button';
import { PHOTOS } from '@/data/photos';
import { CONTACT, SCHOOL } from '@/data/site';

export function Hero() {
  const photo = PHOTOS.campus;
  return (
    <section className="hero on-dark" aria-labelledby="hero-title">
      <img
        className="hero__image"
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="100vw"
        width={photo.width}
        height={photo.height}
        alt=""
        fetchPriority="high"
      />
      <div className="container hero__content">
        <p className="hero__place">
          {SCHOOL.suffix} · {CONTACT.region}
        </p>
        <h1 id="hero-title">Generasi saintis Muslim dimulai dari sini.</h1>
        <p className="hero__lead">
          Membangun generasi unggul melalui pendidikan sains terpadu, teknologi digital, dan
          pembelajaran 2 bahasa asing sejak jenjang SMP.
        </p>
        <div className="hero__actions">
          <ButtonLink to={homeSectionPath(HOME_SECTIONS.form)} variant="gold" size="lg">
            Daftar PPDB
          </ButtonLink>
          <ButtonLink
            to={homeSectionPath(HOME_SECTIONS.programs)}
            variant="outline"
            size="lg"
            className="button--on-dark"
          >
            Lihat program
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
