import HeroSanity from '../components/Hero/HeroSanity';
import ServiciosSanity from '../components/Servicios/ServiciosSanity';
import QuienesSomosSanity from '../components/QuienesSomos/QuienesSomosSanity';
import EquipoSanity from '../components/Equipo/EquipoSanity';
import ContactoSanity from '../components/Contacto/ContactoSanity';

/** Home = Hero + Servicios + Quiénes somos + Equipo + Contacto (antes vivían directo en App.tsx, sin routing).
 * Todas leen de Sanity (componentes *Sanity). */
export default function Home() {
  return (
    <>
      <HeroSanity />
      <ServiciosSanity />
      <QuienesSomosSanity />
      <EquipoSanity />
      <ContactoSanity />
    </>
  );
}
