import HeroSanity from '../components/Hero/HeroSanity';
import ServiciosSanity from '../components/Servicios/ServiciosSanity';
import QuienesSomos from '../components/QuienesSomos/QuienesSomos';
import Equipo from '../components/Equipo/Equipo';
import ContactoSanity from '../components/Contacto/ContactoSanity';
import { quienesContent, quienesValues } from '../data/placeholders';

/** Home = Hero + Servicios + Quiénes somos + Equipo + Contacto (antes vivían directo en App.tsx, sin routing).
 * Hero, Servicios y Contacto leen de Sanity (componentes *Sanity); el resto sigue leyendo de src/data/. */
export default function Home() {
  return (
    <>
      <HeroSanity />
      <ServiciosSanity />
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
