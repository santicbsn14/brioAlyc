import { useMemo } from 'react';
import Acciones from './Acciones';
import { AvisoFaltante } from '../components/FaltaCargar/FaltaCargar';
import { useSanityQuery } from '../sanity/useSanityQuery';
import { HERO_QUERY } from '../sanity/queries';
import type { HeroQueryResult } from '../sanity/types';
import { accionesElegidas } from '../lib/mercado/accionesLideres';
import { atributoEdicion } from '../sanity/edicion';

/** Panel de Cotizaciones con las líderes de "seccionHero" (las mismas del panel del Hero). Usa la
 * query del Hero para compartir su caché: si se llega desde la home, no vuelve a pedir.
 *  - cargando → la página con la tabla sin filas (los precios se piden igual, en paralelo);
 *  - error de red → sin líderes: el estado vacío, y el buscador anda;
 *  - Hero sin publicar o sin acciones → lo mismo, y en dev un aviso chico arriba de la tabla.
 * El resto de la página (textos, columnas) no pasa por Sanity en esta etapa. */
export default function AccionesSanity() {
  const { data, status } = useSanityQuery<HeroQueryResult>(HERO_QUERY);
  const hero = data?.hero;
  const lideres = useMemo(() => accionesElegidas(hero?.accionesPanel), [hero]);

  if (status === 'cargando') return <Acciones lideres={null} />;
  if (status === 'error') return <Acciones lideres={[]} />;

  return (
    <Acciones
      lideres={lideres}
      lideresEdit={atributoEdicion('seccionHero', 'seccionHero', 'accionesPanel')}
      avisoLideres={
        lideres.length === 0 && (
          <AvisoFaltante texto="Faltan las acciones del panel: Inicio → Hero (portada) → Panel de acciones" />
        )
      }
    />
  );
}
