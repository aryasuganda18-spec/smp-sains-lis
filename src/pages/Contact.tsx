import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { HOME_SECTIONS, homeSectionPath } from '@/app/routes';
import { FacebookIcon, InstagramIcon } from '@/components/icons';
import { PageBanner } from '@/components/layout/PageBanner';
import { ButtonLink } from '@/components/ui/Button';
import { CONTACT, FAQ, MAPS_URL, WHATSAPP_MESSAGES } from '@/data/site';
import { useDocumentMeta } from '@/lib/hooks';
import { whatsAppLink } from '@/lib/whatsapp';

export function Contact() {
  useDocumentMeta('Kontak', `Hubungi SMP Sains Lombok Islamic School di ${CONTACT.region}.`);
  return (
    <>
      <PageBanner title="Kontak" lead="Kami membalas pesan WhatsApp pada jam kerja." />
      <section className="section" aria-label="Cara menghubungi sekolah">
        <div className="container card-grid card-grid--3">
          <article className="card">
            <MessageCircle size={26} aria-hidden="true" className="card__icon" />
            <h2 className="card__title">WhatsApp</h2>
            <p>{CONTACT.phoneDisplay}</p>
            <ButtonLink href={whatsAppLink(CONTACT.whatsappId, WHATSAPP_MESSAGES.inquiry)} variant="primary" size="sm">
              Kirim pesan
            </ButtonLink>
          </article>
          <article className="card">
            <MapPin size={26} aria-hidden="true" className="card__icon" />
            <h2 className="card__title">Alamat</h2>
            <p>{CONTACT.address}</p>
            <ButtonLink href={MAPS_URL} variant="outline" size="sm">
              Buka di Google Maps
            </ButtonLink>
          </article>
          <article className="card">
            <Mail size={26} aria-hidden="true" className="card__icon" />
            <h2 className="card__title">Email &amp; media sosial</h2>
            <p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
            <div className="card__social">
              <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="icon-button icon-button--light" aria-label="Facebook sekolah">
                <FacebookIcon />
              </a>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="icon-button icon-button--light" aria-label="Instagram sekolah">
                <InstagramIcon />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section section--sand" aria-labelledby="faq-title">
        <div className="container container--narrow">
          <h2 id="faq-title" className="section__title">
            Pertanyaan yang sering diajukan
          </h2>
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.question} name="faq" className="faq__item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="faq__cta">
            <ButtonLink to={homeSectionPath(HOME_SECTIONS.form)} variant="primary">
              Isi formulir pendaftaran
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
