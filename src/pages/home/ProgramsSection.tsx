import { HOME_SECTIONS } from '@/app/routes';
import { PROGRAMS } from '@/data/site';

export function ProgramsSection() {
  return (
    <section id={HOME_SECTIONS.programs} className="section" aria-labelledby="program-title">
      <div className="container">
        <header className="section__head">
          <h2 id="program-title">Program unggulan</h2>
          <p className="lead">Empat program yang berjalan sepanjang tahun ajaran.</p>
        </header>
        <ul className="card-grid card-grid--2">
          {PROGRAMS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card">
              <Icon size={28} aria-hidden="true" className="card__icon" />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
