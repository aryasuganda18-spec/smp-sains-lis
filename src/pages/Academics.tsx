import { HOME_SECTIONS, homeSectionPath } from '@/app/routes';
import { PageBanner } from '@/components/layout/PageBanner';
import { ButtonLink } from '@/components/ui/Button';
import { ACADEMICS, FACILITIES } from '@/data/site';
import { useDocumentMeta } from '@/lib/hooks';

export function Academics() {
  useDocumentMeta('Akademik', ACADEMICS.lead);
  return (
    <>
      <PageBanner title={ACADEMICS.title} lead={ACADEMICS.lead} />
      <section className="section" aria-labelledby="kurikulum-title">
        <div className="container prose">
          <h2 id="kurikulum-title">Kurikulum</h2>
          <p className="lead">{ACADEMICS.curriculum}</p>
        </div>
      </section>
      <section className="section section--sand" aria-labelledby="fasilitas-title">
        <div className="container">
          <header className="section__head">
            <h2 id="fasilitas-title">Fasilitas</h2>
          </header>
          <ul className="card-grid card-grid--3">
            {FACILITIES.map(({ photo }, index) => (
              <li key={index} className="card card--media">
                {photo && (
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                    width={photo.width}
                    height={photo.height}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--center">
        <div className="container">
          <h2>Tertarik bergabung?</h2>
          <p className="lead">Isi formulir pendaftaran, admin akan menghubungi Anda.</p>
          <ButtonLink to={homeSectionPath(HOME_SECTIONS.form)} variant="primary" size="lg">
            Daftar PPDB
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
