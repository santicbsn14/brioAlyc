// TEMPORAL (no se commitea): hace de Studio sin login. Monta la web en un iframe y habla con ella con
// el mismo protocolo que Presentation (comlink): canal con "visual-editing" y canal con "loaders".
// Las queries se responden con lo publicado (sin token); `__editar` simula un cambio sin publicar.
import { createClient } from '@sanity/client';
import { createController } from '@sanity/comlink';

const params = new URLSearchParams(location.search);
const destino = params.get('web') ?? 'http://localhost:4173/';
const origen = new URL(destino).origin;

const client = createClient({ projectId: 's4crxz9i', dataset: 'production', apiVersion: '2026-10-01', useCdn: false });

type W = Window & Record<string, unknown>;
const w = window as unknown as W;
const registro = { navs: [] as unknown[], focus: [] as unknown[], queries: [] as string[], estado: {} as Record<string, string>, documentos: 0 };
w.__registro = registro;

/** Ediciones simuladas: (query, resultado) → resultado cambiado. */
let ediciones: ((q: string, r: unknown) => unknown)[] = [];
const escuchando = new Map<string, { query: string; params: Record<string, unknown> }>();

const controller = createController({ targetOrigin: origen });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ve = controller.createChannel<any, any>({ name: 'presentation', connectTo: 'visual-editing', heartbeat: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lo = controller.createChannel<any, any>({ name: 'presentation', connectTo: 'loaders', heartbeat: true });

ve.onStatus((e) => (registro.estado.ve = e.status));
lo.onStatus((e) => {
  registro.estado.lo = e.status;
  if (e.status === 'connected') lo.post('loader/perspective', { projectId: 's4crxz9i', dataset: 'production', perspective: 'drafts' });
});
ve.on('visual-editing/navigate', (d: unknown) => void registro.navs.push(d));
ve.on('visual-editing/focus', (d: unknown) => void registro.focus.push(d));
ve.on('overlay/focus', (d: unknown) => void registro.focus.push(d));
lo.on('loader/documents', (d: { documents: unknown[] }) => void (registro.documentos = d.documents.length));

async function responder(query: string, qParams: Record<string, unknown>) {
  const { result, resultSourceMap } = await client.fetch(query, qParams, {
    filterResponse: false,
    resultSourceMap: 'withKeyArraySelector',
    perspective: 'published',
  });
  let r = result;
  for (const e of ediciones) r = e(query, r);
  lo.post('loader/query-change', {
    projectId: 's4crxz9i',
    dataset: 'production',
    perspective: 'drafts',
    query,
    params: qParams,
    result: r,
    resultSourceMap,
  });
}

lo.on('loader/query-listen', (d: { query: string; params: Record<string, unknown> }) => {
  const clave = d.query + JSON.stringify(d.params);
  if (!escuchando.has(clave)) {
    escuchando.set(clave, { query: d.query, params: d.params });
    registro.queries.push(d.query.slice(0, 60));
    void responder(d.query, d.params);
  }
});

/** Simula una edición sin publicar: aplica `cambio` a los resultados y reenvía todas las queries. */
w.__editar = (cambio: (q: string, r: unknown) => unknown) => {
  ediciones.push(cambio);
  for (const { query, params: p } of escuchando.values()) void responder(query, p);
};
w.__sinEdiciones = () => {
  ediciones = [];
};
/** Navega la web desde "el Studio" (barra de la vista previa). */
w.__navegar = (url: string) => ve.post('presentation/navigate', { type: 'push', url });

const iframe = document.getElementById('web') as HTMLIFrameElement;
iframe.src = destino;
iframe.addEventListener('load', () => {
  controller.addTarget(iframe.contentWindow!);
});
ve.start();
lo.start();
