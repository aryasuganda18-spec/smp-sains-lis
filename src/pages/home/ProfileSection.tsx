import { HOME_SECTIONS } from "@/app/routes";
import { PHOTOS } from "@/data/photos";
import { PROFILE } from "@/data/site";

export function ProfileSection() {
  const photo = PHOTOS.courtyard;
  return (
    <section
      id={HOME_SECTIONS.profile}
      className="section"
      aria-labelledby="profil-title"
    >
      <div className="container split">
        <div className="split__text">
          <h2 id="profil-title">Sekolah yang mengajak siswa bereksperimen.</h2>
          <p className="lead">{PROFILE.intro}</p>
          <blockquote className="quote">{PROFILE.quote}</blockquote>
        </div>
        <img
          className="split__media"
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 32rem, 100vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
