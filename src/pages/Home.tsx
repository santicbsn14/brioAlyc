import { useLocation } from 'react-router-dom';
import HeroSanity from '../components/Hero/HeroSanity';
import ServiciosSanity from '../components/Servicios/ServiciosSanity';
import QuienesSomosSanity from '../components/QuienesSomos/QuienesSomosSanity';
import EquipoSanity from '../components/Equipo/EquipoSanity';
import ContactoSanity from '../components/Contacto/ContactoSanity';
import { tieneParametrosAjenos } from '../seo/paginas';
import { useNoIndex } from '../seo/useSeo';

/** Home = Hero + Servicios + Quiénes somos + Equipo + Contacto (antes vivían directo en App.tsx, sin routing).
 * Todas leen de Sanity (componentes *Sanity). */
export default function Home() {
  // URLs de spam del WordPress viejo ("/?x=…", "/?p=…"): noindex mientras traigan esos parámetros
  // (ver tieneParametrosAjenos). Con "?motivo=", utm_*, gclid o fbclid, la home se indexa normal.
  const { search } = useLocation();
  useNoIndex(tieneParametrosAjenos(search));

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
