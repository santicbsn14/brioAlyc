import Hero from '../components/Hero/Hero';
import Servicios from '../components/Servicios/Servicios';
import QuienesSomos from '../components/QuienesSomos/QuienesSomos';
import Equipo from '../components/Equipo/Equipo';
import Contacto from '../components/Contacto/Contacto';
import {
  heroContent,
  heroCtas,
  credentials,
  stocksInitial,
  panelCopy,
  serviciosContent,
  servicePillars,
  instrumentGroups,
  quienesContent,
  quienesValues,
} from '../data/placeholders';

/** Home = Hero + Servicios + Quiénes somos + Equipo + Contacto (antes vivían directo en App.tsx, sin routing). */
export default function Home() {
  return (
    <>
      <Hero
        kicker={heroContent.kicker}
        title={heroContent.title}
        lead={heroContent.lead}
        ctas={heroCtas}
        credentials={credentials}
        stocks={stocksInitial}
        panelTitle={panelCopy.title}
        panelTag={panelCopy.tag}
        panelFootnote={panelCopy.footnote}
      />
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
      <Contacto />
    </>
  );
}
