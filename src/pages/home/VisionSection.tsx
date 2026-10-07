import { HOME_SECTIONS } from '@/app/routes';
import { PROFILE } from '@/data/site';

export function VisionSection() {
  return (
    <section id={HOME_SECTIONS.vision} className="section section--dark on-dark" aria-labelledby="visi-title">
      <div className="container vision">
        <div>
          <h2 id="visi-title">Visi</h2>
          <p className="vision__statement">{PROFILE.vision}</p>
        </div>
        <div>
          <h2 className="vision__missions-title">Misi</h2>
          <ol className="missions">
            {PROFILE.missions.map((mission) => (
              <li key={mission}>{mission}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
