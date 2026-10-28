// Edición visual: la web adentro de la "Vista previa" (Presentation) del Studio.
// Este archivo y todo lo que importa se baja aparte, solo cuando la página está adentro de la
// vista previa (main.tsx): la web pública no lo carga nunca. Ver PROGRESO.md, entrada
// "Vista previa del Studio (edición visual)".
//
// Qué hace:
//  - Datos: cambia el hook de las queries (sanity/useSanityQuery.ts) por el del loader oficial
//    (@sanity/react-loader). Arranca con lo publicado y, en cuanto el Studio se conecta, el Studio
//    mismo le pasa los resultados (con los borradores) por la vista previa, con la sesión de quien
//    está logueado: la web no usa ningún token. Cada cambio en el Studio llega al instante.
//  - Stega: cada texto trae al final caracteres invisibles que dicen de qué documento y campo
//    sale; con eso los overlays saben qué campo abrir al tocarlo. Para usar un texto en otra cosa
//    que pintarlo, sanity/limpiar.ts.
//  - Fotos y PDF: el atributo data-sanity (sanity/edicion.ts).
//  - Overlays y navegación: <VisualEditing>, con React Router conectado a la barra de la vista
//    previa en los dos sentidos.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { StegaConfig } from '@sanity/client/stega';
import { createQueryStore } from '@sanity/react-loader';
import {
  createDataAttribute,
  VisualEditing,
  type HistoryAdapter,
  type HistoryAdapterNavigate,
  type SuspiciousStegaReport,
} from '@sanity/visual-editing/react';
import { sanityClient } from '../client';
import { studioUrl } from '../config';
import { registrarAtributoEdicion } from '../edicion';
import { usarHookVistaPrevia, type Parametros, type ResultadoQuery } from '../useSanityQuery';

/** Campos que no llevan marcas invisibles aunque sean texto: son valores internos que el código
 * compara (el estilo y las viñetas del texto legal, la marca "Resaltado", la categoría de un
 * informe). Con marcas, el texto legal y el resaltado dejarían de pintarse bien. */
const SIN_MARCAS = new Set(['style', 'listItem', 'marks', 'categoria']);

const filtroStega: NonNullable<StegaConfig['filter']> = (props) => {
  const camino = props.sourcePath;
  const ultimo = camino.at(-1);
  // Cada marca de un pedazo de texto (`marks[0]`…).
  if (typeof ultimo === 'number' && camino.at(-2) === 'marks') return false;
  if (typeof ultimo === 'string' && SIN_MARCAS.has(ultimo)) return false;
  // El email de Datos de la empresa: por defecto Sanity no lo marca (por el nombre del campo),
  // pero se pinta y Agus lo tiene que poder tocar. El mailto: se arma con el texto limpio.
  if (ultimo === 'email') return true;
  return props.filterDefault(props);
};

/** Cliente con stega: lo usa el loader para el primer pedido (lo publicado) y para las marcas. */
const client = sanityClient.withConfig({
  useCdn: false,
  perspective: 'published',
  stega: { enabled: true, studioUrl, filter: filtroStega },
});

const { useQuery, useLiveMode } = createQueryStore({ client, ssr: false });

/** Mismo contrato que el hook de la web pública: `{ data, status }`. */
function useSanityQueryVistaPrevia<T>(query: string, params: Parametros): ResultadoQuery<T> {
  const { data, loading, error } = useQuery<T | null>(query, params);
  if (error) return { data: undefined, status: 'error' };
  if (data === undefined) return { data: undefined, status: loading ? 'cargando' : 'listo' };
  return { data, status: 'listo' };
}

usarHookVistaPrevia(useSanityQueryVistaPrevia);
registrarAtributoEdicion((doc, campo) =>
  createDataAttribute({ baseUrl: studioUrl, id: doc.id, type: doc.type, path: campo }).toString(),
);

/** En desarrollo, avisa en la consola si quedó un texto con marcas donde no va (un atributo, un
 * link…): es un lugar que falta limpiar con sanity/limpiar.ts. */
const avisarStega = import.meta.env.DEV
  ? (reportes: SuspiciousStegaReport[]) => {
      for (const r of reportes) console.warn(`[vista previa] Texto con marcas invisibles en ${r.kind}:`, r);
    }
  : undefined;

/**
 * Overlays de edición + datos en vivo + navegación sincronizada. Va adentro de <BrowserRouter>
 * (main.tsx), al lado de <App>.
 */
export default function VistaPrevia() {
  useLiveMode({ client });

  const navigate = useNavigate();
  const location = useLocation();

  // Para avisarle al Studio adónde navegó la web (la barra de la vista previa sigue a la web).
  const [avisarAlStudio, setAvisarAlStudio] = useState<HistoryAdapterNavigate>();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // El Studio navega la web (barra de la vista previa, "Abrir" de un documento, atrás/adelante).
  const history = useMemo<HistoryAdapter>(
    () => ({
      subscribe: (avisar) => {
        setAvisarAlStudio(() => avisar);
        return () => setAvisarAlStudio(undefined);
      },
      update: (cambio) => {
        if (cambio.type === 'push' || cambio.type === 'replace') {
          navigateRef.current(cambio.url, { replace: cambio.type === 'replace' });
        } else if (cambio.type === 'pop') {
          navigateRef.current(-1);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    avisarAlStudio?.({ type: 'push', url: `${location.pathname}${location.search}${location.hash}` });
  }, [avisarAlStudio, location.pathname, location.search, location.hash]);

  return <VisualEditing portal history={history} zIndex={1000} onSuspiciousStega={avisarStega} />;
}
