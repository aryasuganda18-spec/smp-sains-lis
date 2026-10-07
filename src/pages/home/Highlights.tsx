import { HIGHLIGHTS } from '@/data/site';

export function Highlights() {
  return (
    <section className="highlights" aria-label="Keunggulan sekolah">
      <ul className="container highlights__list">
        {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="highlight">
            <Icon size={26} aria-hidden="true" />
            <div>
              <h2 className="highlight__title">{title}</h2>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
