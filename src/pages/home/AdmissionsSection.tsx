import { MessageCircle } from 'lucide-react';
import { HOME_SECTIONS } from '@/app/routes';
import { ButtonLink } from '@/components/ui/Button';
import { ADMISSION_STEPS, CONTACT, PPDB, WHATSAPP_MESSAGES } from '@/data/site';
import { PpdbForm } from '@/features/ppdb/PpdbForm';
import { whatsAppLink } from '@/lib/whatsapp';

export function AdmissionsSection() {
  return (
    <section id={HOME_SECTIONS.admissions} className="section" aria-labelledby="ppdb-title">
      <div className="container admissions">
        <div className="admissions__intro">
          <p className="badge">PPDB {PPDB.academicYear}</p>
          <h2 id="ppdb-title">{PPDB.headline}</h2>
          <p className="lead">{PPDB.lead}</p>
          <ol className="steps">
            {ADMISSION_STEPS.map((step) => (
              <li key={step.title}>
                <h3 className="steps__title">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <ButtonLink
            href={whatsAppLink(CONTACT.whatsappId, WHATSAPP_MESSAGES.inquiry)}
            variant="outline"
            icon={MessageCircle}
          >
            Tanya admin lewat WhatsApp
          </ButtonLink>
        </div>
        <div id={HOME_SECTIONS.form} className="admissions__form">
          <h3 className="admissions__form-title">Formulir pendaftaran</h3>
          <PpdbForm />
        </div>
      </div>
    </section>
  );
}
