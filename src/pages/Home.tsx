import HeroSanity from '../components/Hero/HeroSanity';
import Servicios from '../components/Servicios/Servicios';
import QuienesSomos from '../components/QuienesSomos/QuienesSomos';
import Equipo from '../components/Equipo/Equipo';
import ContactoSanity from '../components/Contacto/ContactoSanity';
import {
  serviciosContent,
  servicePillars,
  instrumentGroups,
  quienesContent,
  quienesValues,
} from '../data/placeholders';

/** Home = Hero + Servicios + Quiénes somos + Equipo + Contacto (antes vivían directo en App.tsx, sin routing).
 * Hero y Contacto leen de Sanity (componentes *Sanity); el resto sigue leyendo de src/data/. */
export default function Home() {
  return (
    <>
      <HeroSanity />
      <Servicios
        kicker={serviciosContent.kicker}
        title={serviciosContent.title}
        lead={serviciosContent.lead}
        pillars={servicePillars}
        instrumentsTitle={serviciosContent.instrumentsTitle}
        instrumentGroups={instrumentGroups}
        feesTitle={serviciosContent.feesTitle}
        feesLead={serviciosContent.feesLead}
        feesCtaLabel={serviciosContent.feesCtaLabel}
      />
      <QuienesSomos
        kicker={quienesContent.kicker}
        title={quienesContent.title}
        paragraphs={quienesContent.paragraphs}
        photoAlt={quienesContent.photoAlt}
        values={quienesValues}
      />
      <Equipo />
      <ContactoSanity />
    </>
  );
}
