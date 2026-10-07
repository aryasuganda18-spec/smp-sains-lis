import { useDocumentMeta } from '@/lib/hooks';
import { SCHOOL } from '@/data/site';
import { AdmissionsSection } from './AdmissionsSection';
import { Hero } from './Hero';
import { Highlights } from './Highlights';
import { ProfileSection } from './ProfileSection';
import { ProgramsSection } from './ProgramsSection';
import { VisionSection } from './VisionSection';

export function Home() {
  useDocumentMeta(undefined, `${SCHOOL.name}: ${SCHOOL.tagline}. Informasi program, fasilitas, dan pendaftaran PPDB.`);
  return (
    <>
      <Hero />
      <Highlights />
      <ProfileSection />
      <VisionSection />
      <ProgramsSection />
      <AdmissionsSection />
    </>
  );
}
