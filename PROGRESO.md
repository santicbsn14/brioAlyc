# PROGRESO — Brio Valores (sitio nuevo)

## Estado actual
Front nuevo (`brio-nuevo`, separado de la web puente) con routing (React Router): home (`/`, header + hero + Servicios + Quiénes somos + Equipo + Contacto — ya completa, las 5 secciones de esta etapa), página propia de comisiones (`/comisiones`, con las tablas completas del PDF por pestañas), página de productos (`/servicios/productos`, carrusel animado de instrumentos por categoría), página de Financiamiento PyME (`/servicios/financiamiento-pyme`, con el paso a paso animado de 4 etapas), página de Informes (`/informes`, colgada del menú Herramientas: listado de PDFs filtrable por categoría, con descarga directa) y ahora también el Panel de Renta Fija (`/herramientas/renta-fija`, colgada del menú Herramientas: ONs, Deuda Soberana + LECAPs/BONCAPs, Calendario de pagos y Cartera propia, con datos y cálculos reales vía un proxy propio a data912; clickear cualquier ticker abre un panel lateral con su flujo de fondos futuro, recalculable para un monto a invertir). El header (Navbar) ya quedó terminado: logo real, menú con dropdowns funcionales (Servicios y Herramientas), link nuevo a Equipo, fondo que cambia al scrollear y los 3 anchors de la home (Quiénes somos/Equipo/Contacto) funcionando cross-página (navegan a la home y scrollean, parados en cualquier ruta). Ahora también hay Footer institucional (montado en `App.tsx`, visible en todas las páginas) y dos páginas legales (`/codigo-de-conducta`, texto real de Brio; `/terminos-y-condiciones`, borrador genérico a reemplazar). Quiénes somos ya tiene la foto real de oficina y quedó en 2 bloques (relato + valores), sin el bloque de números. En Servicios, las descripciones de los 3 pilares ya son texto real (rescatado del sitio anterior). Equipo muestra 3 socios (tarjeta con bio corta + "Ver más" que despliega la bio completa) y 9 empleados (grilla simple), con contenido real: nómina, cargos, bios y fotos de 11 de las 12 personas (falta solo la foto de Claudio Adrián Iglesias, que se ve con avatar de iniciales). Contacto tiene formulario funcional con validación, honeypot y un endpoint real de envío por mail (Resend, en `api/contacto.ts`) — falta que Vercel tenga configuradas las variables de entorno reales para que mande mails de verdad. Los botones "Consultá por tu PyME" de Financiamiento PyME ya llevan a Contacto con el motivo correcto preseleccionado. Los datos reales de contacto (teléfono, email, dirección) ya están sincronizados entre `data/footer.ts` y `data/contacto.ts`; solo quedan de ejemplo WhatsApp, horario e Instagram/LinkedIn. En Informes, el primer informe ya es real (PDF real, descarga funcional); los otros tres son de ejemplo para mostrar el filtro funcionando. El resto del contenido sigue en placeholder salvo los valores de comisiones (ya reales, transcriptos y cruzados contra el PDF fuente) y los datos financieros de Renta Fija (ONs, soberanos, LECAPs, BONCAPs — reales, portados de la herramienta vieja). El panel de acciones del Hero ya muestra precios reales de BYMA (8 acciones líderes, vía `/api/mercado/arg-stocks` → data912), con fallback a precios de ejemplo mientras carga o si falla. Esas mismas 8 acciones tienen su tabla completa en el Panel de Cotizaciones (`/herramientas/acciones`, colgado del menú Herramientas: compra/venta/último/variación/volumen, ordenable, con buscador, auto-refresh elegible y export CSV). Con esto la home queda completa para esta etapa; falta el resto del sitio.

## Estructura de archivos
```
brio-nuevo/
  api/
    contacto.ts             → función serverless de Vercel (POST): valida y manda el mail de contacto vía Resend
    _lib/
      data912.ts             → proxy a data912 con caché en memoria (TTL 90s), dedup de requests en vuelo y fallback a caché vencida si data912 falla (prefijo "_" → Vercel no lo expone como endpoint, solo lo importan las funciones de mercado/)
    mercado/
      arg-corp.ts             → GET /api/mercado/arg-corp → proxea data912.com/live/arg_corp (ONs)
      arg-bonds.ts             → GET /api/mercado/arg-bonds → proxea data912.com/live/arg_bonds (soberanos + BONCAPs)
      arg-notes.ts             → GET /api/mercado/arg-notes → proxea data912.com/live/arg_notes (LECAPs)
      arg-stocks.ts            → GET /api/mercado/arg-stocks → proxea data912.com/live/arg_stocks (acciones BYMA, para el panel del Hero)
  src/
    styles/
      tokens.css            → paleta de marca + fuentes (Poppins/Sora)
    lib/
      mercado/
        accionesLideres.ts    → parser de arg_stocks (tipo `CotizacionAccion`) para el panel del Hero y la tabla de /herramientas/acciones: precio `c`, `pct_change`, puntas `px_bid`/`px_ask` y volumen `v`, sin exigir volumen; null por dato faltante, null si no vino ningún ticker
      rentaFija/
        calc.ts               → motor de cálculo financiero (calcTIR, calcDuration, calcLecapRates, calcLecapK, fmtVol, parseVenc/daysTo), portado tal cual de la herramienta vieja
        flujoFondos.ts         → lógica del panel lateral de flujo de fondos por ticker (qué pagos mostrar, pago único de LECAP/BONCAP, escala por monto invertido y totales), portada tal cual de openCFDrawer/calcFlows
        lookups.ts             → parsers de data912 y lookups de precio (d912parse, d912parseAll, calcTCMEP, lookupON/Bond/LecapOrBoncap + variantes *Vol), portados tal cual
        calendar.ts            → arma los eventos de pago (renta/amortización) de todos los instrumentos cargados, por fecha (base de la pestaña Calendario)
        cartera.ts             → universo de títulos + cálculo de flujos de una cartera cargada por el usuario + TIR/duration ponderadas (agregado nuevo, no estaba en la herramienta vieja)
        format.ts              → formateo de números/fechas compartido por las 4 pestañas
        data/
          bonds.ts              → BONDS (ONs) y SOVEREIGN_BONDS con sus cashflows reales, dato ESTÁTICO portado tal cual de la herramienta vieja — candidato a Sanity (ver pendientes)
          lecapsYBoncaps.ts      → LECAPS_DATA y BONCAPS_DATA (tasa de emisión, días, vencimiento), dato ESTÁTICO portado tal cual — mismo candidato a Sanity
    hooks/
      useReveal.ts           → aparición progresiva al scrollear, reusable en toda la home
      useScrollToTop.ts       → al cambiar de ruta: sin hash scrollea a (0,0); con hash (ej. #contacto) espera a que el elemento exista y hace scrollIntoView
      useRentaFija.ts         → hook central del Panel de Renta Fija: fetch a los 3 endpoints propios, precios manuales + localStorage, auto-refresh por grupo (ONs / Soberana+LECAPs), filas calculadas para las 4 pestañas
      useAccionesLideres.ts   → cotizaciones de las acciones líderes (Hero + /herramientas/acciones): fallback → fetch a /api/mercado/arg-stocks, auto-refresh configurable (`intervalSec`, default 90s; 0 = apagado) con la pestaña visible, `status`/`lastUpdated`/`refrescar` para la barra de estado, resaltado de filas que cambiaron; latido simulado opcional (`simularLatido`, solo el Hero) mientras se ven precios de ejemplo
    data/
      placeholders.ts       → contenido de Navbar/Hero/Servicios/Quiénes somos (textos, links, credenciales, precios de EJEMPLO del panel de acciones como fallback, pilares, instrumentos), tipado
      accionesLideres.ts     → ACCIONES_LIDERES: los 8 tickers (ticker + nombre) del panel del Hero, dato ESTÁTICO — candidato a Sanity (ver pendientes)
      comisiones.ts         → tablas de comisiones (título/columnas/filas/notas por tabla, agrupadas en pestañas), tipado, valores reales del PDF
      productos.ts          → categorías de productos, sus instrumentos y las líneas explicativas + textos de encabezado de la página, tipado, contenido provisorio
      financiamiento.ts     → textos de la página de Financiamiento PyME (encabezado, beneficios, pasos, cierre y botón), tipado, contenido provisorio
      informes.ts             → contenido de la página de Informes (encabezado, categorías, listado de informes con fecha/categoría/resumen/PDF), tipado; solo el primer informe es real, el resto son de ejemplo
      contacto.ts            → contenido de la sección Contacto (motivos, canales, redes, textos de estado), tipado; email/teléfono/dirección ya reales, WhatsApp/horario/redes siguen de ejemplo
      equipo.ts               → contenido de la sección Equipo (kicker/título/bajada, 3 socios con bio corta + `bioExtendida?`, 9 empleados), tipado; contenido REAL (nombres/cargos/bios/fotos importadas de `assets/equipo/`), salvo la foto de Claudio Iglesias que falta, con nota sobre el modelo probable en Sanity (un solo tipo "Persona" con flag "esSocio")
      footer.ts               → contenido del Footer (contacto, dirección, redes, razón social, registro CNV, credenciales, links legales), tipado, datos reales
      legal.ts                → contenido de las dos páginas legales: `codigoConducta` (texto real de Brio, por capítulos/artículos) y `terminosCondiciones` (borrador genérico, con TODO de asesoría legal)
    hooks/
      useReveal.ts           → aparición progresiva al scrollear, reusable en toda la home
      useScrollToTop.ts       → al cambiar de ruta: sin hash scrollea a (0,0); con hash (ej. #contacto) espera a que el elemento exista y hace scrollIntoView
    components/
      Navbar/
        Navbar.tsx
        Navbar.module.css
      Hero/
        Hero.tsx
        Hero.module.css
      Servicios/
        Servicios.tsx        → ya NO tiene la tabla de comisiones, ahora es un CTA a /comisiones
        Servicios.module.css
      QuienesSomos/
        QuienesSomos.tsx
        QuienesSomos.module.css
      Equipo/
        Equipo.tsx            → sección #equipo: 3 socios (tarjeta con avatar/foto, nombre, cargo, bio) + grilla de 9 empleados (avatar/foto, nombre, cargo, sin tarjeta ni bio); avatar placeholder con iniciales mientras no haya foto real
        Equipo.module.css
      Contacto/
        Contacto.tsx          → sección #contacto: sello+título+bajada+canales+redes, y formulario con validación/honeypot/estados
        Contacto.module.css
      Footer/
        Footer.tsx             → footer institucional: logo / Contacto / Dirección / Seguinos + franja legal (razón social, registro CNV, credenciales, links legales) + copyright
        Footer.module.css
      RentaFija/
        RentaFija.module.css   → estilos de las 4 pestañas del Panel de Renta Fija (tabs con indicador deslizante, status bar, tablas, calendario, cartera) — también lo importa pages/RentaFija.tsx
        TablaONs.tsx           → pestaña Obligaciones Negociables: buscador + 6 filtros rápidos + input editable donde no hay precio de mercado + export CSV
        TablaSoberana.tsx      → pestaña Deuda Soberana: tabla de soberanos (agrupados por Globales/Bonares/Bopreales) + tabla de LECAPs/BONCAPs (TNA/TEM/TEA) + export CSV
        Calendario.tsx         → pestaña Calendario: grilla mensual real (días de la semana, navegación mes a mes, filtro por tipo de instrumento), con tooltip/hoja de detalle por día y click a flujo de fondos
        Cartera.tsx            → pestaña Cartera: alta/baja de posiciones, TIR y duration ponderadas, calendario de flujos de la cartera, export CSV
        FlujoFondosDrawer.tsx  → panel lateral que se abre al clickear un ticker (ONs, Soberana, LECAPs/BONCAPs y Cartera): resumen del título, monto a invertir (USD/ARS o nominales), 3 tarjetas de totales y tabla de pagos futuros
        FlujoFondosDrawer.module.css
    pages/
      Home.tsx               → agrupa Hero + Servicios + QuienesSomos + Equipo + Contacto (antes vivía directo en App.tsx)
      Comisiones.tsx          → página /comisiones: header + tabs + tablas responsive
      Comisiones.module.css
      Productos.tsx           → página /servicios/productos: header + pestañas + carrusel con banda de progreso + flechas + dots
      Productos.module.css
      FinanciamientoPyme.tsx → página /servicios/financiamiento-pyme: intro + 3 beneficios + paso a paso de 4 etapas (horizontal en desktop, vertical en celular) + cierre con botón (ya apunta a Contacto con motivo=pyme)
      FinanciamientoPyme.module.css
      Informes.tsx            → página /informes: header + chips de filtro por categoría + listado de informes (ordenado por fecha descendente) con descarga
      Informes.module.css
      Acciones.tsx + .module.css → página /herramientas/acciones (Panel de Cotizaciones): header con reveal + buscador + status bar (estado, hora, intervalo, Actualizar, Exportar CSV) + tabla ordenable de las 8 acciones líderes + disclaimer. Usa `hooks/useAccionesLideres.ts` (el mismo del Hero)
      RentaFija.tsx            → página /herramientas/renta-fija: header + 4 tabs con indicador real (refs) + status bar (por grupo ONs / Soberana+LECAPs) + panel con slide + disclaimer. Usa `hooks/useRentaFija.ts` para todo el estado/datos y los componentes de `components/RentaFija/` para cada pestaña
      CodigoConducta.tsx      → página /codigo-de-conducta: texto legal real de Brio, completo, por capítulos
      TerminosCondiciones.tsx → página /terminos-y-condiciones: borrador genérico (TODO asesoría legal)
      LegalDoc.module.css     → estilos compartidos por las dos páginas legales (documento navy, sin tarjetas)
      ComingSoon.tsx          → placeholder mínimo ("Próximamente") para rutas que todavía no tienen página real — hoy ninguna ruta lo usa (se deja por si aparece una ruta nueva sin página)
    App.tsx                  → Navbar fuera de <Routes> (siempre visible) + <Routes> ("/" → Home, "/comisiones" → Comisiones, "/servicios/productos" → Productos, "/servicios/financiamiento-pyme" → FinanciamientoPyme, "/informes" → Informes, "/herramientas/acciones" → Acciones, "/herramientas/renta-fija" → RentaFija, "/codigo-de-conducta" → CodigoConducta, "/terminos-y-condiciones" → TerminosCondiciones) + Footer fuera de <Routes> (siempre visible, en todas las páginas)
    main.tsx                 → envuelve <App/> en <BrowserRouter>
    index.css
  tsconfig.api.json          → proyecto TS aparte para tipar api/ (Node, no browser)
  .env.example                → variables que necesita api/contacto.ts (RESEND_API_KEY, CONTACTO_DESTINATARIO), sin valores reales
```

## Historial

### 2026-10-07 — Fix: las funciones de mercado fallaban en producción (ERR_MODULE_NOT_FOUND)
- **Síntoma:** en el sitio publicado en Vercel, el Panel de Cotizaciones (`/herramientas/acciones`) y el Panel de Renta Fija mostraban "—" en vez de precios. En los logs de Vercel, las 4 funciones de mercado (`api/mercado/arg-stocks`, `arg-bonds`, `arg-corp`, `arg-notes`) tiraban `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/api/_lib/data912'`. En local (`vercel dev`) andaba todo bien.
- **Causa:** las 4 funciones importan el proxy compartido (`api/_lib/data912.ts`) sin poner la extensión del archivo. El proyecto está configurado como "módulos ES" (`"type": "module"`), y en ese modo Node exige la extensión en los imports. En local no se notaba porque `vercel dev` empaqueta cada función con sus dependencias y resuelve el import solo; el build de producción de Vercel, en cambio, compila cada archivo por separado sin empaquetarlo, así que el import llegaba tal cual a Node, que no encontraba el archivo.
- **Fix:** en las 4 funciones el import ahora apunta a `../_lib/data912.js` (con `.js` aunque el archivo fuente sea `.ts`: es la convención de TypeScript para módulos ES, porque el import apunta al archivo ya compilado). No se tocaron `api/_lib/data912.ts` ni `api/contacto.ts` (no tienen este tipo de import).
- **Archivos modificados:** los 4 de `api/mercado/`.

**Verificación:**
- `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios (el `.js` apuntando a un `.ts` no da error con la configuración actual de `tsconfig.api.json`).
- Commit + push a `main`; Vercel publicó el deploy de producción automáticamente (`brio-alyc.vercel.app`).
- Las 4 funciones responden OK (200) en producción con datos reales de data912. En los logs de Vercel del deploy nuevo, todas las llamadas a las 4 funciones aparecen sin error y ya no figura `ERR_MODULE_NOT_FOUND`.
- Se verificó con Playwright (Chromium headless) contra el sitio publicado, en desktop 1440px y mobile 390px: `/herramientas/acciones` muestra las 8 acciones con precios reales (ninguna celda en "—"); en Renta Fija, la pestaña ONs muestra precios, TIR, duration y volumen reales (algunas pocas celdas en "—", que son ONs puntuales sin operación hoy en data912, no un error), y Deuda Soberana muestra soberanos y LECAPs/BONCAPs con datos reales y sin ninguna celda en "—" (y sin las LECAPs vencidas, confirmando también la tarea anterior). Sin errores de consola.

**Pendientes que quedaron abiertos:**
- **Problema nuevo detectado (no es de esta tarea):** en producción, entrar directo a cualquier página que no sea la home (escribiendo la dirección, recargando la página o abriendo un link compartido, por ej. `brio-alyc.vercel.app/herramientas/acciones`) muestra el error 404 de Vercel. Navegando desde la home funciona bien. Falta configurar Vercel para que todas las rutas carguen el sitio (una regla de reescritura en un `vercel.json`, cuidando de no afectar las rutas `/api/`).

### 2026-10-07 — Link al Panel de Cotizaciones desde Servicios + LECAPs vencidas fuera de la tabla
Dos pendientes técnicos chicos, sin diseño nuevo.

- **Link en Servicios:** en la home, sección Servicios → bloque de instrumentos → Renta variable, el ítem "Panel de cotizaciones en vivo →" ahora es un link real que lleva a `/herramientas/acciones`. Se ve exactamente igual que antes (mismo color y tamaño que el resto de la lista); solo suma un subrayado al pasar el mouse o al llegar con el teclado, para que se note que es clickeable. Para esto, la lista de instrumentos ahora acepta que un ítem sea "texto + destino del link"; el resto de los ítems siguen siendo texto plano, sin cambios. (Aclaración: el brief mencionaba la página de Productos, pero ese ítem en realidad vive en la sección Servicios de la home; en Productos no existe.)
- **LECAPs/BONCAPs vencidas:** la tabla de LECAPs/BONCAPs de la pestaña Deuda Soberana ya no muestra los instrumentos cuyo vencimiento pasó (hoy, S15S6 y S30S6). El filtro es automático: cada día compara contra la fecha de hoy, con el mismo criterio de "liquidación mañana" que ya usaba el cálculo de TNA/TEM (se reusó esa misma cuenta de días, no se armó una comparación nueva). Así, cuando una LECAP vence, desaparece sola de la tabla sin tener que tocar los datos.
- **Lo que NO cambió:** el Calendario y la Cartera siguen usando el listado completo de instrumentos, no pasan por este filtro. El Calendario sigue mostrando los vencimientos pasados en su mes (por ej. S30S6 en septiembre), que es lo correcto para un calendario; y como el panel de flujo de fondos ya no abría para una LECAP vencida, clickearla ahí sigue sin abrir nada, igual que antes.
- **Archivos modificados:** `data/placeholders.ts` (el ítem con link y el tipo de la lista), `components/Servicios/` (dibuja el link y su estilo), `lib/rentaFija/calc.ts` (la cuenta de días al vencimiento quedó como función propia, reusada por el cálculo de tasas y por el filtro) y `hooks/useRentaFija.ts` (aplica el filtro al armar la tabla).

**Verificación:**
- Se verificó con Playwright (Chromium headless, en el scratchpad de la sesión) sobre el build de producción, en desktop 1440px y mobile 390px, con los precios de mercado mockeados incluyendo dos LECAPs vencidas (S15S6, S30S6) y una vigente (S16O6): el link de Servicios apunta a `/herramientas/acciones`, tiene el mismo color/tamaño/sin subrayado que el texto de al lado, y al clickearlo navega a esa página. En Deuda Soberana aparece S16O6 y no aparecen S15S6 ni S30S6. En el Calendario (desktop) octubre sigue mostrando S16O6 y septiembre sigue mostrando S30S6. Sin scroll horizontal y sin errores de consola. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Pendientes que quedaron abiertos:** ninguno nuevo de esta tarea.

### 2026-10-05 — Página Panel de Cotizaciones (/herramientas/acciones)
- Reemplaza el "Próximamente" del ítem "Panel de cotizaciones" del menú Herramientas. Antes era un ítem deshabilitado y no existía la ruta; ahora es un link activo a `/herramientas/acciones`.
- **Diseño:** portado de `__ref/BrioAcciones.jsx` (prototipo aprobado). Header (kicker "Herramientas" + título + bajada) con aparición al scrollear vía `useReveal`. Toolbar con buscador por ticker o nombre (filtra en el cliente) y barra de estado. Tabla Ticker / Nombre / Compra / Venta / Último / Var. % / Volumen. Estado vacío del prototipo y disclaimer al pie.
- **Barra de estado** (igual que Renta Fija): punto de color idle/cargando/ok/error, hora del último refresh, selector de intervalo (sin auto-refresh / 1 / 2 / 5 min, default 2), botón Actualizar y botón Exportar CSV.
- **Orden:** las 7 columnas se ordenan clickeando el encabezado (asc/desc con flechita y `aria-sort`; el encabezado es un `<button>`, accesible por teclado). Los datos faltantes van siempre al final, en las dos direcciones.
- **Formato:** Var. % con ▲/▼/– y colores `--up`/`--down` de tokens.css. Volumen con `fmtVol` de Renta Fija (se importa, no se duplicó).
- **Export CSV:** mismo formato que el de Renta Fija (comillas, BOM, números crudos sin formatear). Exporta las filas visibles con el filtro y el orden activos. Archivo: `briovalores-acciones-AAAA-MM-DD.csv`.
- **Datos:** reusa todo lo de la tarea del Hero, sin duplicar nada (`ACCIONES_LIDERES`, `/api/mercado/arg-stocks`, el parser y `useAccionesLideres`). El hook se extendió sin cambiar cómo lo llama el Hero:
  - Tercer parámetro opcional `{ intervalSec, simularLatido }`. Default 90s y latido activado, que es justo lo que ya usaba el Hero.
  - Ahora devuelve también `status`, `lastUpdated` y `refrescar`.
  - Cambiar el intervalo no dispara un fetch, solo rearma el timer (criterio de Renta Fija). El fetch inicial pasó a un `setTimeout(0)`, mismo patrón que `useRentaFija`.
  - El parser ahora lee además `px_bid`, `px_ask` y `v`. El tipo pasó de `HeroStock` a `CotizacionAccion`; `bid`/`ask`/`volume` son opcionales porque el fallback del Hero no los tiene.

**Archivos creados:** `src/pages/Acciones.tsx`, `src/pages/Acciones.module.css`.
**Archivos modificados:** `src/hooks/useAccionesLideres.ts` (intervalo configurable, status/lastUpdated/refrescar, latido opcional), `src/lib/mercado/accionesLideres.ts` (bid/ask/volumen + rename del tipo), `src/App.tsx` (ruta nueva), `src/data/placeholders.ts` (el ítem del dropdown pasa a `internal` con `href`).

**Decisiones propias / desvíos del brief:**
- **Sin precios de ejemplo en la tabla:** a diferencia del Hero, mientras carga o si data912 falla las 8 filas se ven con "—". Una tabla de cotizaciones con compra/venta inventadas sería engañosa. La barra de estado dice "Cargando cotizaciones…" o "No pudimos obtener cotizaciones" (o, si ya hubo un dato bueno, la hora + "falló el último intento"), con el punto en rojo. Si un ticker puntual no viene en la respuesta, su fila muestra "—".
- **Ruta:** el brief decía que `/herramientas/acciones` "pasa de `<ComingSoon />` a `<Acciones />`", pero esa ruta no existía en `App.tsx`. Se creó directamente. `ComingSoon.tsx` queda sin uso; no se borró.
- **Bajada:** el prototipo decía "Precios en vivo…", lo que contradice el disclaimer "no en tiempo real". Quedó "Precios de las principales acciones líderes de BYMA — datos referenciales, con actualización automática cada 2 minutos aproximadamente."
- **Toolbar:** el selector de intervalo no estaba en el prototipo. Se sumó dentro de la barra de estado con el mismo estilo que en Renta Fija. Orden: punto · hora · intervalo · Actualizar · Exportar CSV.
- **Kicker:** lleva la rayita teal a la izquierda, igual que el port de Renta Fija/Informes (el prototipo no la tenía), para que las páginas de Herramientas se vean iguales.
- **Bug del prototipo corregido:** en mobile la toolbar pasa a columna, y el `flex: 1 1 260px` del buscador se convertía en 260px de ALTO (input gigante). Se fijó `flex: none` en ese breakpoint.
- En mobile la tabla scrollea horizontalmente dentro de su contenedor (`min-width: 680px`, igual que el prototipo), sin scroll horizontal de página.

**Verificación:** con Playwright (Chromium headless, en el scratchpad de la sesión), desktop 1440px y mobile 390px, interceptando `/api/mercado/arg-stocks` con datos del formato real de data912:
- **Navegación:** desde la home se llega a la página clickeando Herramientas → "Panel de cotizaciones" en el navbar, con el dropdown en desktop y el menú hamburguesa en mobile.
- **Datos:** las 8 filas muestran compra, venta, último, variación y volumen del mock. Un volumen 0 se ve "—" y una variación 0 se ve "– 0,0%" en gris.
- **Orden:** Ticker, Nombre, Compra, Venta, Último, Var. % y Volumen ordenan bien en asc y desc. Se cotejó el orden contra los valores del mock: Último asc da ALUA 830 → BMA 11.040; Var. % asc da BMA -5,14 → BBAR 5,63. `aria-sort` cambia en consecuencia.
- **Buscador:** "ypf" → YPFD, "banco" → BMA, "gas del" → TGSU2; "zzzz" muestra el estado vacío.
- **CSV:** con filtro "ba" y orden Volumen desc, el archivo trae el encabezado de las 7 columnas y exactamente BMA y BBAR, en ese orden.
- **Actualizar:** el botón dispara 1 fetch.
- **Intervalos, con el reloj falso de Playwright (`page.clock`):**
  - Default 2 min: 1 fetch a los 120s.
  - Cambiar a 1 min no dispara fetch; después, 1 fetch a los 61s y otro a los 60s siguientes.
  - 5 min: 0 fetches a los 299s y 1 a los 301s.
  - Sin auto-refresh: 0 fetches en 15 min.
- **502 con reduced motion:** las 8 filas en "—", estado "No pudimos obtener cotizaciones", header visible de entrada (opacity 1, transición 0s).
- **Regresión del Hero:** sigue mostrando los 8 precios reales (`data-fuente=data912`).
- **Chequeos:** sin errores de consola y sin scroll horizontal en mobile. `npx tsc -b`, `npx tsc -p tsconfig.api.json`, `npx eslint .` y `npm run build` corren limpios.

**Pendientes que quedaron abiertos:**
- Convertir "Panel de cotizaciones en vivo →" (Servicios → Renta variable) en link a esta página.
- Los mismos de la tarea del Hero: `ACCIONES_LIDERES` como candidato a Sanity (agendar con Agus) y probar `/api/mercado/arg-stocks` contra data912 real en un deploy de Vercel.

### 2026-10-05 — Hero: panel de acciones con datos reales de BYMA (data912)
- Nuevo endpoint `api/mercado/arg-stocks.ts`, que proxea `data912.com/live/arg_stocks`. No hizo falta generalizar `api/_lib/data912.ts`: ya estaba indexado por endpoint (caché TTL 90s, fallback a caché vencida, dedup en vuelo), así que el handler es igual a los de Renta Fija.
- Nueva lista `data/accionesLideres.ts` (`ACCIONES_LIDERES`) con 8 tickers y su nombre amigable: GGAL, YPFD, PAMP, ALUA, BMA, CEPU, TGSU2, BBAR. Es estática y candidata a Sanity (ver pendientes). El panel ya mostraba ticker + nombre, así que se mantienen los dos.
- El Hero ahora usa el hook `useAccionesLideres`:
  - El primer render muestra los precios de ejemplo (`stocksInitial`, que ahora se arma desde la misma lista: mismas 8 filas, mismo orden) y al montar pide `/api/mercado/arg-stocks`.
  - Si la respuesta es buena, pasa a precios reales.
  - Si falla (HTTP de error, red caída, JSON inválido o ninguno de los 8 tickers en la respuesta), se queda con lo que había. El Hero nunca queda vacío.
- Refresca cada 90s (igual al TTL del proxy) solo con la pestaña visible, y al volver a la pestaña si ya pasó ese tiempo.
- Si un refresh falla después de haber mostrado datos reales, se mantiene el último dato real. No vuelve a los precios de ejemplo.
- Parser (`lib/mercado/accionesLideres.ts`): mismo criterio de lectura que `d912parse` (symbol normalizado, `c` = último precio, descarta precios inválidos o <= 0), más `pct_change`. Ese campo viene en porcentaje (1.59 = 1,59%), cotejado con un `curl` real a data912. Si a un ticker puntual le falta el precio, su fila muestra "—" en gris en vez de inventar un número.
- El diseño del panel no se tocó (glassmorphism, `bob`, punto "en vivo" pulsante, filas). Lo único nuevo en CSS es el gris del "—".

**Archivos creados:** `api/mercado/arg-stocks.ts`, `src/data/accionesLideres.ts`, `src/lib/mercado/accionesLideres.ts`, `src/hooks/useAccionesLideres.ts`.
**Archivos modificados:** `components/Hero/Hero.tsx` (usa el hook; props `leaders` + `fallbackStocks` en vez de `stocks`; atributo `data-fuente` en el panel), `components/Hero/Hero.module.css` (clase `.chg.na`), `data/placeholders.ts` (`stocksInitial` derivado de `ACCIONES_LIDERES` con precios de ejemplo actualizados), `pages/Home.tsx` (pasa las props nuevas).

**Decisiones propias / desvíos del brief:**
- **Volumen:** no se exige `v > 0`. El panel es informativo, así que muestra el último precio aunque el papel no haya operado hoy. En Renta Fija el volumen sí importa porque decide qué precio entra en la TIR.
- **Latido:**
  - Con datos reales ya no se simulan movimientos: inventar variaciones encima de precios reales de una ALyC sería engañoso.
  - La sensación de "panel vivo" se mantiene con el punto pulsante, el `bob` y el resaltado de las filas que cambiaron en cada refresh (en la primera carga real se resaltan todas, como señal de "actualizado").
  - El latido simulado original (deriva aleatoria + resaltado) sigue solo mientras se ven los precios de ejemplo (carga o falla), y respeta reduced-motion como antes.
- **Precios de ejemplo:** el mock tenía 5 filas con precios muy desfasados (ej. YPFD 41.200 contra ~8.200 real). Pasó a 8 filas, igual que la lista real, para que no haya salto de layout. Los precios se acercaron al orden de magnitud real de oct. 2026 para que el cambio a datos reales no sea brusco.
- **Disclaimer:** no se agregó uno nuevo. El panel ya tenía el tag "Referencial" y el pie "Datos referenciales · no en tiempo real", que sigue siendo cierto (caché de 90s + la demora propia de data912).
- **Altura del panel:** con 8 filas pasa de ~405px a 562px. En 1440x900 entra completo dentro del Hero y en mobile queda debajo del texto, como antes. "Transportadora de Gas del Sur" se corta con "…" en mobile, con el CSS de ellipsis que ya existía.

**Verificación:** con Playwright (Chromium headless, en el scratchpad de la sesión), desktop 1440px y mobile 390px, interceptando `/api/mercado/arg-stocks`:
- **Respuesta OK** (datos con el formato real de data912, con 1,2s de demora): primero se ven las 8 filas de ejemplo y después los 8 precios y % del mock en el orden de la lista. El panel mide 562px antes y después, sin layout shift. `data-fuente` pasa de `ejemplo` a `data912`.
- **Fallas:** con 502, red abortada y array vacío, el panel queda con las 8 filas de ejemplo (`data-fuente=ejemplo`), sin romperse.
- **Respuesta parcial** (3 de 8 tickers): esos 3 con precio real y el resto con "—".
- **Consola y layout:** sin scroll horizontal y sin errores de la app. En los escenarios de falla, el único mensaje en consola es el log de red del propio navegador ("Failed to load resource" por el 502 o el abort), esperable para un fetch que falla y que no se puede silenciar desde el código.
- **Chequeos:** `npx tsc -b`, `npx tsc -p tsconfig.api.json`, `npx eslint .` y `npm run build` corren limpios.

**Pendientes que quedaron abiertos:**
- Agendar con Agus: `ACCIONES_LIDERES` como candidato a Sanity.
- Probar el endpoint contra data912 real en un deploy de Vercel (`vite dev` no corre las funciones serverless; en local el sitio siempre muestra el fallback de ejemplo, salvo que se use `vercel dev`).

### 2026-10-05 — Equipo: contenido real completo (fotos, nómina, bios de socios con "Ver más")
- Se reemplazó todo el contenido de ejemplo de `data/equipo.ts` por el real: 3 socios (Carlos Alberto Rodríguez Ansaldi — Presidente del Directorio, Pablo Alberto Bortolato — Socio, Claudio Adrián Iglesias — Socio) con bio corta y bio extendida, y los 9 empleados con nombre, cargo y foto. Las 11 fotos (todas menos la de Claudio) se importan desde `src/assets/equipo/` (WebP 960x1200 que subió Santiago).
- Claudio queda sin `foto`, así que sigue mostrando el avatar con iniciales (TODO(Agus) comentado en el dato).
- Nuevo campo opcional `bioExtendida?: string` en `Socio`. Si una persona lo tiene, la tarjeta muestra un link chico "Ver más" debajo de la bio corta. Al tocarlo, la bio completa se despliega dentro de la misma tarjeta y el link pasa a "Ver menos". Sin `bioExtendida`, no aparece el link.
- El despliegue anima la altura con `grid-template-rows: 0fr → 1fr` (0,3s), que sigue la altura real del texto sin un `max-height` fijo. Con "reducir animaciones" activado no hay transición. Accesibilidad: el botón lleva `aria-expanded` + `aria-controls` (id generado con `useId`), y el contenido colapsado queda `inert` para que no lo lea un lector de pantalla ni reciba foco.
- Se dejó comentada en `data/equipo.ts` la nota de la décima persona (Comercial) que se suma en noviembre; no se agregó un casillero vacío.
- No se tocaron el layout, la animación de aparición ni el resto del diseño de la sección.
- Se verificó con Playwright (Chromium headless, en el scratchpad de la sesión) en desktop 1440px y mobile 390px. Los 3 socios muestran nombre, cargo y bio corta; Carlos y Pablo con su foto, Claudio con el avatar "CI". Los 9 empleados muestran nombre, cargo y foto cargada (960px de ancho natural), y cada `src` coincide con el archivo de esa persona. En los 3 socios, "Ver más" cambia `aria-expanded` a `true` y el texto a "Ver menos", y despliega la bio extendida completa (altura 0 → ~270–434px, ya sin `inert`); un segundo click vuelve a colapsar (altura 0). Con `prefers-reduced-motion: reduce`, la transición computada es `0s` y el despliegue funciona igual. Sin errores de consola y sin scroll horizontal en mobile. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos modificados:** `data/equipo.ts` (contenido real + tipo `bioExtendida?`), `components/Equipo/Equipo.tsx` (componente `BioExtendida` + iniciales), `components/Equipo/Equipo.module.css` (estilos del despliegue y del link "Ver más", sin transición con reduced-motion).

**Decisiones propias / desvíos del brief:**
- Iniciales del avatar placeholder: antes tomaba las 2 primeras palabras, así que "Claudio Adrián Iglesias" daba "CA". Ahora toma nombre + último apellido ("CI"). Para nombres de 2 palabras da lo mismo que antes. Es el único cambio a la lógica del avatar; el fallback de foto/iniciales queda igual.
- Al desplegar una bio en desktop, las otras dos tarjetas de la fila se estiran a la misma altura, porque la grilla ya tenía altura de fila compartida. Visualmente queda prolijo y no se cambió el layout para evitarlo.
- Los `id` de las personas pasaron de `s1`/`e1` a slugs del nombre (`carlos-rodriguez-ansaldi`, etc.), que son más estables de cara a Sanity.

**Pendientes que quedaron abiertos:**
- TODO(Agus): foto de Claudio Adrián Iglesias.
- Décima persona (área Comercial) que se suma en noviembre: hay que sumarla a `empleados` cuando llegue.

### 2026-10-01 — Panel de Renta Fija: Calendario como grilla mensual real (no lista)
- Reemplaza la pestaña Calendario, que la tarea del 2026-09-24 había portado como una lista agrupada por mes (simplificación visual autorizada en ese momento), por una grilla de calendario mensual real — como pidió Agus al ver la herramienta vieja, que sí tenía esa grilla (`_buildCalEvents`/`renderCal`/`setCalFilter`/`calPrev`/`calNext`/`calGoToday`/`showCalTooltip` en `herramientaRentaFija.html`). Se portó la LÓGICA tal cual (qué eventos se arman, cómo se ordenan dentro de un día) y se rediseñó la presentación con la identidad de Brio.
- **Grilla:** 7 columnas de Lunes a Domingo (el original empezaba en Domingo; se usa el orden habitual en Argentina) por semanas del mes, con header de mes/año, navegación ← mes → y botón "Hoy". El día de hoy se destaca con un borde teal; los días de relleno del mes anterior/siguiente se ven atenuados y sin eventos (igual que el original).
- **Filtro por tipo de instrumento (pendiente real de la tarea del 2026-09-24, ahora resuelto):** chips "Todos / ONs / Soberanos / LECAPs-BONCAPs", mismo lenguaje visual que los filtros de las otras pestañas. El filtro no tocó `buildCalEvents` (`lib/rentaFija/calendar.ts`): como esa función ya recibe los 4 arreglos de instrumentos como parámetro, alcanzó con pasarle arreglos vacíos para los tipos no elegidos — mismo resultado que el `_calFilter` del original, sin agregar un parámetro nuevo a la función.
- **Dentro de cada día:** hasta 4 eventos, ordenados ambos → amort → renta (mismo criterio que el original); si hay más, "+N más". Cada evento abre el panel de flujo de fondos ya existente (mismo `onTickerClick` que ya usan los tickers de las tablas). Al pasar el mouse (o enfocar con teclado) sobre un evento se ve un tooltip con el detalle de TODOS los eventos de ese día (ticker, tipo, monto) — mismo contenido que `showCalTooltip` del original.
- **Colores (paleta de Brio, no la del original):** teal para Renta, naranja para Amortización; "Renta + Amortización" no usa un tercer color sino un degradé diagonal teal→naranja, para que se lea como "combinación de los otros dos" en vez de un color nuevo sin relación. Leyenda fija debajo de los filtros.
- **Mobile:** con la grilla de 7 columnas angosta, mostrar ticker + tipo en cada evento no entraba sin romper el layout. Decisión propia: por debajo de los 640px (mismo corte que el resto del panel) los eventos se reducen a puntos de color sin texto, y tocar un día abre una hoja inferior (bottom sheet) con el detalle completo (ticker, tipo, monto) de cada evento de ese día; tocar una fila ahí abre el panel de flujo de fondos y cierra la hoja. En desktop el click es directo sobre el evento (sin paso intermedio), como pide el brief; el paso intermedio en mobile es la forma de resolver "detalle completo solo en el tooltip/tap" que pedía el brief sin perder la posibilidad de abrir el flujo de fondos.
- **Tooltip sin seguir al mouse:** a diferencia del original (que posicionaba el tooltip con `clientX/clientY`), acá se ancla por CSS a la celda del día (debajo si está en las primeras 2 semanas de la grilla, arriba si no, para no cortarse contra el borde superior; alineado a la izquierda/derecha/centro según la columna) — mismo contenido y mismo disparador (hover/focus), posicionamiento más simple y accesible por teclado (el tooltip también aparece con foco, no solo con mouse).
- Transición de mes: fade simple (igual que pedía el brief, "nada elaborado"), desactivado con `prefers-reduced-motion`.
- Se verificó con Playwright (Chromium headless, en el scratchpad de la sesión) interceptando `/api/mercado/*` con respuestas vacías (el Calendario no depende de precios de mercado, solo de los cashflows estáticos) en desktop 1440px y mobile 390px: al entrar muestra Octubre 2026 (mes real del sistema) con el día 1 destacado como "hoy"; la LECAP S16O6 (vence 16/10/2026) aparece el día 16; con el filtro "LECAPs / BONCAPs" sigue apareciendo, con el filtro "ONs" desaparece; "Mes siguiente" navega a Noviembre 2026 y un día con más de 4 eventos muestra "+N más"; "Hoy" vuelve a Octubre 2026; "Mes anterior" navega a Septiembre 2026 y ahí aparece S30S6 (vence 30/09/2026). El hover sobre un evento muestra el tooltip con el detalle completo del día; clickear un evento abre el drawer de flujo de fondos con el ticker correcto (verificado con S16O6). En mobile, los eventos se ven como puntos (cero pills de texto), sin scroll horizontal (`scrollWidth === innerWidth` a 390px); tocar un día abre la hoja de detalle y tocar una fila ahí abre el drawer con el ticker correcto. Con `prefers-reduced-motion: reduce`, el `animation-name` de la grilla da `none`. Sin errores de consola en ningún caso. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** ninguno (todo se hizo modificando los archivos existentes de la tarea anterior).
**Archivos modificados:** `src/lib/rentaFija/calendar.ts` (suma `buildMonthGrid`/`CalDayCell`/`sortDayEvents`; `buildCalEvents` no cambió), `src/components/RentaFija/Calendario.tsx` (reescrito: de lista agrupada por mes a grilla mensual con navegación, filtro, tooltip y hoja mobile), `src/components/RentaFija/RentaFija.module.css` (nueva sección de estilos para la grilla; se sacaron `calChipAmbos`/`calChipAmort`/`calChipRenta`/`calChipVal`, que solo usaba la lista vieja — `calList`/`calMonth`/`calRow`/`calDate`/`calEvents`/`calChip`/`carFlowTotal` siguen intactos porque los sigue usando el calendario de flujos de Cartera.tsx), `src/hooks/useRentaFija.ts` (saca `calEvents`: ya no hace falta precomputar un único set de eventos sin filtro, el Calendario arma los suyos propios según el filtro elegido, a partir de los mismos datos estáticos que ya importaba el hook), `src/pages/RentaFija.tsx` (le pasa `onTickerClick` a `<Calendario/>` en vez de `events`).

**Decisiones propias / desvíos del brief:**
- El comportamiento mobile (puntos + hoja de detalle con click-through al drawer) es una decisión propia frente a una pregunta abierta del brief ("decisión de Claude Code según lo que se vea mejor, documentando el criterio"): se eligió una hoja inferior en vez de, por ejemplo, agrandar la celda del día al tocarla, porque no reduce el tamaño del resto de la grilla ni reordena el layout — aparece encima, como el drawer de flujo de fondos.
- Semana de Lunes a Domingo (no Domingo a Sábado como el original): se tomó la opción que el brief marcaba como más probable para el público argentino.
- El tooltip de escritorio no seguía al mouse como el original; se ancla a la celda por CSS. Es una simplificación a propósito (ver más arriba), no un recorte de funcionalidad: muestra la misma información, en el mismo momento.

**Pendientes que quedaron abiertos:**
- Ninguno nuevo de esta tarea. Quedan los pendientes generales de Renta Fija ya anotados más abajo (Sanity para los datos estáticos, probar el proxy contra data912 real en producción, sacar las LECAPs vencidas de la tabla).

### 2026-10-01 — Panel de Renta Fija: panel lateral de flujo de fondos por ticker
- Suma la única funcionalidad real de la herramienta vieja que había quedado afuera al portar el panel (ver entrada del 2026-09-24): al clickear un ticker se abre un panel que se desliza desde la derecha con el detalle de todos los pagos futuros de ese título. La lógica se portó TAL CUAL de `herramientaRentaFija.html` (que está en `Proyectos/BrioValores/`, al lado del repo): mismas reglas de qué pagos mostrar, mismo cálculo para LECAPs/BONCAPs y misma forma de escalar por el monto invertido.
- **Dónde se puede clickear:** los tickers de las tablas de ONs, de Deuda Soberana, de LECAPs/BONCAPs y de las posiciones de la Cartera. El ticker vuelve a verse como link (teal, con la flechita "↗" del prototipo y subrayado al pasar el mouse), y se puede abrir también con el teclado.
- **Qué muestra el panel:** el ticker como título y una línea de datos clave. Para ONs y soberanos: TIR, duration (en años), precio actual y vencimiento — los mismos valores que ya muestra la tabla, no se recalculan. Para LECAPs/BONCAPs: el tipo (LECAP en teal, BONCAP en naranja, mismo criterio de color que la tabla), TNA, TEM, TEA, precio y vencimiento. Debajo, un campo "Inversión" con dos botones para elegir si el monto está en moneda (USD para ONs/soberanos, ARS para LECAPs/BONCAPs) o en nominales; al tipear se recalcula todo al instante. Tres tarjetas (Total cobrado, Cupones, Amortización) y una tabla con un renglón por pago: fecha, cupón, amortización, total y qué porcentaje del total representa ese pago, más un renglón final de TOTAL. Los pagos que incluyen devolución de capital se ven resaltados (fondo levemente naranja con una marca a la izquierda) y hay una leyenda que lo explica.
- **Cómo escala:** sin monto (o con 0 / algo que no es número) muestra los valores "por cada 100 nominales", que es como abre. Con un monto en moneda y precio disponible, convierte a nominales (monto ÷ precio × 100); en modo nominales usa el monto directo. Debajo del campo una línea aclara en qué escala se está viendo ("Valores por cada 100 nominales" / "Equivale a N nominales").
- **LECAPs/BONCAPs:** se muestran como un único pago al vencimiento: total = la "cotización final capitalizada" (la misma K que ya usaba el cálculo de TNA/TEM/TEA), amortización = 100 y cupón = la diferencia. Abren en modo Nominales. Una LECAP/BONCAP ya vencida, o un bono que ya no tiene pagos futuros, directamente no abre el panel (igual que el original, sin mensaje ni error).
- **Cierre:** con la "×", tocando afuera del panel, o con la tecla Escape (que solo se escucha mientras el panel está abierto). Al cerrar, el foco vuelve al ticker que lo abrió. Mientras está abierto la página de atrás no scrollea.
- **Animación:** el panel entra deslizándose desde la derecha y el fondo se oscurece con un fundido (300ms, mismo ritmo que las pestañas del panel). Con "reducir animaciones" activado aparece sin animación.
- Se verificó con Playwright (Chromium headless, en el scratchpad de la sesión) interceptando los precios de mercado con datos de ejemplo, en desktop 1440px y mobile 390px: el panel de LOC5O muestra título, TIR/Duration/Px/Vto y una tabla idéntica a sus pagos futuros reales en `data/bonds.ts` (fechas, montos y amortización, con el renglón de amortización resaltado); con 10.000 USD a precio 101,5 el total pasa de 108,04 a 10.644,73 (= 108,04 × 10.000 / 101,5) y con 5.000 nominales a 5.402,20; al borrar el monto vuelve a 108,04. La LECAP S16O6 abre en Nominales con un único pago de 105,28 (K = 100 × 1,0205 ^ (76/360 × 12) = 105,275, verificado a mano), cupón 5,28 y amortización 100. Una BONCAP abre con su etiqueta de BONCAP. Las tres formas de cerrar funcionan. La LECAP vencida S15S6 no abre nada; como en los datos actuales no hay ningún bono con todos sus pagos en el pasado, ese caso se probó aparte con un bono de prueba y la lógica devuelve "no abrir". Desde la Cartera, el ticker de una posición también abre el panel. Sin errores de consola, sin scroll horizontal en mobile, y con "reducir animaciones" el panel no tiene transición. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** `src/lib/rentaFija/flujoFondos.ts`, `src/components/RentaFija/FlujoFondosDrawer.tsx`, `src/components/RentaFija/FlujoFondosDrawer.module.css`.
**Archivos modificados:** `src/lib/rentaFija/calc.ts` (la fórmula de K de LECAP/BONCAP pasa a una función propia, `calcLecapK`, que usan tanto el cálculo de TNA/TEM/TEA como el panel — misma fórmula, sin cambios), `src/pages/RentaFija.tsx` (guarda qué ticker está abierto y monta el panel), `src/components/RentaFija/TablaONs.tsx`, `TablaSoberana.tsx` y `Cartera.tsx` (el ticker pasa a ser un botón que abre el panel), `src/components/RentaFija/RentaFija.module.css` (estilo del ticker clickeable).

**Decisiones propias / desvíos del original:**
- **Estado:** el panel guarda localmente el monto y la moneda (se resetean cada vez que se abre); la página solo recuerda qué ticker está abierto. Los datos (precios, TIR, TNA, etc.) se toman de las filas que ya calcula el hook central del panel, así que si llega un precio nuevo con el panel abierto, se actualiza solo — igual que en el original, que releía el precio en cada recálculo. No hizo falta tocar el hook.
- **Moneda al abrir:** el original tenía una inconsistencia — si abrías una LECAP (que pasa a Nominales) y después una ON, la ON abría también en Nominales. Acá cada título abre siempre en su moneda por defecto (ONs/soberanos en USD, LECAPs/BONCAPs en Nominales), como pedía el brief.
- **Botón de moneda en LECAPs/BONCAPs dice "ARS"** en vez de "USD", igual que el original (son instrumentos en pesos), y el campo dice "Inversión ARS".
- **Fechas en formato dd/mm/aaaa** (el original las mostraba en formato técnico aaaa-mm-dd) y números con separador de miles en todos los casos, mismo criterio que el resto del panel.
- **En mobile el panel no ocupa todo el ancho:** deja una franja de 40px del fondo oscurecido a la izquierda. Sin eso no había dónde tocar "afuera" para cerrar (se detectó en la verificación) y además ayuda a que se entienda que es un panel encima de la página.
- **Línea de escala y leyenda de amortización:** dos agregados chicos de presentación que el original no tenía ("Valores por cada 100 nominales" / "Equivale a N nominales", y la leyenda del resaltado), para que los números de las tarjetas no queden sin contexto. Si con un monto en USD no hay precio de mercado, la línea lo avisa (el cálculo, como en el original, cae a "por cada 100 nominales").
- **La flechita "↗" del ticker es un elemento aparte oculto para lectores de pantalla**, para que un lector lea solo "LOC5O" y no "LOC5O flecha".

**Pendientes que quedaron abiertos:**
- En el original, los chips de la grilla del Calendario también abrían este panel. En el calendario actual (que era una lista, ver entrada del 2026-09-24) los chips seguían sin acción; el brief de esta tarea no lo pedía. **Resuelto el 2026-10-01** (ver esa entrada: la nueva grilla mensual ya conecta cada evento al mismo panel).
- Observación (no es de esta tarea): las LECAPs ya vencidas (hoy S15S6 y S30S6) siguen apareciendo en la tabla de LECAPs/BONCAPs con días negativos, porque los datos estáticos todavía las incluyen. Conviene sacarlas de `data/lecapsYBoncaps.ts` cuando se actualicen los datos (o filtrarlas en la tabla).

### 2026-09-24 — Panel de Renta Fija (/herramientas/renta-fija): proxy propio + motor de cálculo + 4 pestañas
- Reemplaza el "Próximamente" del ítem "Renta fija" del menú Herramientas por el panel real. Dos referencias para esta tarea: el diseño/interacción salió de `__ref/BrioRentaFija.jsx` (prototipo aprobado, con datos de ejemplo) y TODA la lógica real (motor de cálculo, datos de bonos, fetch a data912) se portó de `herramientaRentaFija.html` — la herramienta vieja de Brio en Netlify, standalone. Se pidió portar esta lógica TAL CUAL, sin reescribirla: son cálculos financieros.
- **Verificación de fidelidad (lo más importante de esta tarea):** antes de dar por buena la migración, se armaron scripts aparte (Node, en el scratchpad de la sesión, no quedan en el repo) que corren el algoritmo ORIGINAL (copiado línea por línea del HTML viejo) y el algoritmo PORTADO (`lib/rentaFija/calc.ts` y `lib/rentaFija/lookups.ts`) con los mismos datos reales (cashflows de GD30D, todas las LECAPs/BONCAPs, casos de parseo de data912) y se compararon los resultados uno a uno. calcTIR, calcDuration, calcLecapRates, d912parse, d912parseAll, calcTCMEP y lookupON dieron resultado IDÉNTICO (bit a bit) entre el original y el portado, en todos los casos probados. Esto es más confiable que solo "revisar el código a ojo" para algo financiero.
- **Parte 1 — Proxy propio (`api/mercado/arg-corp.ts`, `arg-bonds.ts`, `arg-notes.ts`):** cada uno le pega a `https://data912.com/live/<endpoint>` y cachea la última respuesta buena en una variable de módulo (`api/_lib/data912.ts`) con TTL de 90s; si data912 falla y hay caché (aunque esté vencida) la devuelve igual con header `X-Data-Stale: true`; si falla y no hay ninguna caché previa, responde 502. Requests simultáneas al mismo endpoint sin caché válida comparten una sola promesa (no disparan 2 fetches en paralelo a data912). Se verificó este módulo aparte con un script Node que mockea `global.fetch`: confirma cache-hit sin refetch, dedup de 2 pedidos simultáneos, el caso "sin caché + falla → lanza" (el handler lo traduce a 502) y el caso "caché vencida + falla → devuelve la vieja con `stale:true`" (forzando un TTL corto de prueba). Mismo patrón de función serverless "clásica" (req/res de Node, sin `@vercel/node`) que ya usa `api/contacto.ts`.
- **Parte 2 — Motor y datos (`src/lib/rentaFija/`):** `calc.ts` (calcTIR, calcDuration, calcLecapRates, fmtVol, parseVenc/daysTo), `lookups.ts` (d912parse, d912parseAll, calcTCMEP, lookupON/Bond/LecapOrBoncap y sus variantes de volumen), `data/bonds.ts` (BONDS: 105 ONs; SOVEREIGN_BONDS: 20 soberanos, ambos con cashflows completos) y `data/lecapsYBoncaps.ts` (7 LECAPs + 4 BONCAPs). Los datos se extrajeron programáticamente del HTML viejo (parseados y comparados campo a campo) para evitar errores de tipeo al portar ~7000 líneas de cashflows a mano. Ambos archivos de datos tienen la nota pedida sobre que son estáticos y candidatos a Sanity en una fase futura. Diferencia estructural (no de comportamiento) respecto al original: el HTML viejo guardaba los precios de mercado en variables globales mutables; acá esos mapas viven en estado de React y se pasan como parámetro a las mismas funciones — mismo cálculo, sin variables globales.
- **Parte 3 — Componente (`hooks/useRentaFija.ts` + `pages/RentaFija.tsx` + `components/RentaFija/`):** 4 tabs (ONs / Soberana / Calendario / Cartera) con indicador deslizante posicionado con refs reales sobre cada botón (no un placeholder), panel con slide lateral (~320ms) según la dirección del cambio de pestaña, respeta `prefers-reduced-motion`. Status bar independiente para ONs y para Soberana+LECAPs (punto de color idle/cargando/ok/error, hora del último refresh, botón Actualizar, selector de intervalo sin-autorefresh/1min/2min/5min — mismos valores que el original). ONs: buscador + 6 filtros rápidos (todos/ley local/ley NY/con precio/duration<1/duration<3), donde no hay precio de mercado se muestra un input editable que persiste en `localStorage` (`brio_manual_prices`) y calcula TIR/duration hasta que vuelva a haber precio real — mismo criterio que `manualPrices` del original. Soberana: tabla agrupada por Globales/Bonares/Bopreales + tabla aparte de LECAPs/BONCAPs con TNA/TEM/TEA (en vez de TIR/duration). Calendario: listado de próximos pagos ordenado por fecha (adaptado a lista, la lógica de qué eventos mostrar se portó tal cual). Cartera: alta de posiciones (ticker + nominales, con datalist de todo el universo de títulos), TIR y duration ponderadas por valor de mercado, calendario de flujos de la cartera, todo persistido en `localStorage` (`brio_cartera_positions`). Export CSV en ONs, Soberana y Cartera.
- **Bug real encontrado y corregido durante la verificación:** el primer intento de auto-fetch al montar usaba un guard con `useRef` para "disparar una sola vez". Bajo `<StrictMode>` (activo en `main.tsx`), React monta-desmonta-remonta los efectos en desarrollo: el `cleanup` (`clearTimeout`) cancelaba el único fetch programado y el guard impedía reprogramarlo en el segundo paso — el resultado era que `fetchOns`/`fetchSov` NUNCA se ejecutaban en desarrollo (en producción, sin StrictMode, sí hubiera andado, pero es un bug real y confuso). Se sacó el guard: el propio `cleanup` ya hace que este patrón sea seguro bajo StrictMode sin necesidad de un ref. Se encontró comparando cuidadosamente los valores esperados vs. los que mostraba Playwright con datos mockeados (ver verificación).
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión) interceptando `/api/mercado/*` con datos de ejemplo (ya que `vite dev` no corre las funciones serverless — eso requiere `vercel dev`, no se usó por el riesgo de que pida login interactivo): desktop 1440px y mobile 390px. Un ticker con volumen mockeado (LOC5O) muestra precio de mercado en texto plano (sin input); un ticker sin volumen (LOC6O) muestra el input, tipear "97.55" recalcula TIR/duration al toque, y tras recargar la página el valor sigue ahí. El filtro "Ley NY" y el buscador filtran correctamente. CSV se descarga. El indicador de tab se mueve al cambiar de pestaña (se verificó el `transform` calculado). En Soberana, un bono con precio mockeado muestra TIR/duration y una LECAP/BONCAP con precio mockeado muestra TNA. Calendario lista eventos. Cartera: agregar una posición de prueba (GD30D, 1000 VN) muestra las 4 tarjetas (Posiciones/TIR ponderada/Duration ponderada/Total) con valores, y tras recargar la posición sigue ahí. Sin errores de consola en ningún caso. Con `prefers-reduced-motion: reduce` la animación del panel queda en `none`. Se encontró y corrigió un overflow horizontal de 2px en mobile (la barra de estado no wrappeaba en pantallas muy chicas) verificado con un chequeo de `document.documentElement.scrollWidth` contra `window.innerWidth`. `npx tsc -b`, `npx tsc -p tsconfig.api.json` (tipos de las funciones serverless) y `npx eslint .` corren limpios; `npm run build` también.

**Archivos creados:** `api/_lib/data912.ts`, `api/mercado/arg-corp.ts`, `api/mercado/arg-bonds.ts`, `api/mercado/arg-notes.ts`, `src/lib/rentaFija/calc.ts`, `src/lib/rentaFija/lookups.ts`, `src/lib/rentaFija/calendar.ts`, `src/lib/rentaFija/cartera.ts`, `src/lib/rentaFija/format.ts`, `src/lib/rentaFija/data/bonds.ts`, `src/lib/rentaFija/data/lecapsYBoncaps.ts`, `src/hooks/useRentaFija.ts`, `src/pages/RentaFija.tsx`, `src/components/RentaFija/RentaFija.module.css`, `src/components/RentaFija/TablaONs.tsx`, `src/components/RentaFija/TablaSoberana.tsx`, `src/components/RentaFija/Calendario.tsx`, `src/components/RentaFija/Cartera.tsx`.
**Archivos modificados:** `App.tsx` (ruta `/herramientas/renta-fija` pasa de placeholder a la página real), `data/placeholders.ts` (el ítem "Renta fija" del dropdown Herramientas deja de estar deshabilitado y pasa a link activo).

**Decisiones propias / desvíos del brief:**
- **TIR y duration ponderadas de la Cartera son un agregado nuevo:** la herramienta vieja NO las calculaba (solo mostraba posiciones + calendario de flujos); el brief de esta tarea sí las pide. Se implementaron reusando el mismo motor de cálculo (promedio ponderado por valor de mercado de la TIR/duration de cada posición; para LECAPs/BONCAPs se usa la TNA como "tir" y el plazo en años como duration, tratando el pago único como un cupón cero — es una convención financiera estándar, no una fórmula inventada). Solo entran al promedio las posiciones que tienen precio disponible hoy (de mercado o manual).
- **Precio manual también disponible en Soberana y LECAPs/BONCAPs**, no solo en ONs: el brief solo detallaba el input editable para la pestaña ONs, pero la herramienta vieja SÍ tenía esa capacidad para soberanos y LECAPs (muy útil ahí en particular, porque las LECAPs frecuentemente no tienen volumen del día y sin un precio de referencia la fila queda sin TNA/TEM). Se replicó el mismo criterio ASIMÉTRICO del original: en ONs el precio manual se restaura solo si hoy no hay precio de mercado (hay un mapa "manual" aparte); en Soberana/LECAPs el precio manual se pisa/borra en el siguiente auto-refresh si el instrumento no operó ese día (no hay mapa "manual" aparte en el original tampoco) — se mantuvo la asimetría a propósito, es el comportamiento real de la herramienta vieja.
- **Sin drawer de flujo de fondos por ticker:** el original tenía un panel lateral (`openCFDrawer`) al clickear un ticker, mostrando el detalle de cashflows para un monto invertido. No estaba pedido explícitamente en el brief de esta tarea (que solo listaba columnas de tabla) y se dejó fuera para no ampliar el alcance; el ticker ya no tiene el "↗" del prototipo porque hoy no lleva a ningún lado. **Resuelto el 2026-10-01** (ver esa entrada).
- **Calendario como lista, no grilla mensual:** el brief habilitaba explícitamente "adaptar visualmente, no necesariamente igual al original" — se portó la lógica de qué eventos mostrar (`_buildCalEvents`) tal cual, pero se muestra como lista agrupada por mes (mismo patrón visual que el calendario de flujos de Cartera) en vez de la grilla de calendario con celdas por día del original. **Resuelto el 2026-10-01** (ver esa entrada).
- No se implementó el filtro ONs/Soberana/LECAPs del calendario original (`_calFilter`): se muestra siempre todo, por simplicidad y porque no estaba en los criterios de verificación del brief. **Resuelto el 2026-10-01** (ver esa entrada).
- No se corrió `vercel dev` para probar los 3 endpoints end-to-end vía HTTP real (podía pedir login/link interactivo y trabar la sesión). En su lugar se probó `api/_lib/data912.ts` de forma aislada (mockeando `fetch`) y se verificó que `npx tsc -p tsconfig.api.json` tipa limpio con el mismo patrón que ya usa `api/contacto.ts` en producción.

**Pendientes que quedaron abiertos:**
- **Agendar con Agus:** decidir si `BONDS`/`SOVEREIGN_BONDS`/`LECAPS_DATA`/`BONCAPS_DATA` (hoy estáticos en `src/lib/rentaFija/data/`, solo los puede editar el desarrollador) se modelan en Sanity en una Fase 2, para que Brio pueda cargar una LECAP nueva o corregir un cashflow sin pedir un deploy.
- **Decisión explícita de Santiago:** la Cartera y los precios manuales viven en `localStorage` del navegador, sin cuenta de usuario — cada dispositivo/navegador tiene su propia cartera, no hay sincronización entre dispositivos ni con una cuenta real.
- Falta probar el proxy contra el data912 real en un deploy de Vercel (el desarrollo local solo lo probó con `fetch` mockeado); confirmar ahí que el header `X-Data-Stale` llega bien y que el TTL de 90s se comporta como se espera bajo tráfico real.
- El drawer de flujo de fondos por ticker (ver el detalle de cashflows de un bono para un monto a invertir) quedó afuera de esta tarea; si Brio lo quiere de vuelta, es una pestaña/modal nueva reusando `calc.ts`. **Resuelto el 2026-10-01.**
- Dos entradas de `SOVEREIGN_BONDS` (`GD41D`, otro BOPREAL) traen campos `emisor`/`lamina` de más, residuo de la herramienta vieja (no se usan en ningún cálculo) — se preservaron tal cual, sin "limpiar" el dato de origen.


### 2026-09-23 — Sección Equipo (home) + Navbar: link a Equipo y fix de anchors cross-página
- Se portó el prototipo aprobado (`__ref/BrioEquipo.jsx`) a la sección Equipo real, montada en la home entre Quiénes somos y Contacto (`#equipo`). Es la última sección que faltaba: con esto la home queda completa para esta etapa (Hero → Servicios → Quiénes somos → Equipo → Contacto). Se sube a producción con contenido PLACEHOLDER a propósito — el objetivo de la tarea era cerrar el diseño y la animación, no esperar la nómina real.
- **Diseño:** encabezado centrado (kicker + título + bajada) igual que el resto de secciones de la home. Dos tratamientos, como en el prototipo: 3 socios en tarjeta propia (fondo y borde sutil, avatar/foto en marco vertical 4:5, nombre, cargo en teal, bio) y 9 empleados en grilla simple sin tarjeta ni bio (mismo marco 4:5 pero más chico, nombre y cargo), con el label "Equipo" centrado arriba. La grilla de empleados cae de 5 columnas en desktop a 3 en tablet (900px) y 2 en mobile chico (480px), verificado con Playwright en los tres anchos.
- **Placeholder de foto:** mientras el campo `foto` de una persona esté vacío se muestra un avatar con las iniciales (mismas 2 primeras letras, mayúsculas), alternando fondo teal/naranja entre personas. El mismo componente (`Avatar`, dentro de `Equipo.tsx`) ya soporta mostrar una foto real en el mismo marco (`object-fit: cover`) apenas el campo `foto` tenga valor — no hace falta tocar el componente el día que carguen las fotos, solo `data/equipo.ts`.
- **Animación:** reusa `useReveal.ts` con un único ref en la sección (mismo patrón que Quiénes somos/Contacto, no uno por bloque). Stagger por índice vía la custom property `--i` (mismo mecanismo que ya usa Quiénes somos en su bloque de valores): en socios el delay crece de a 100ms por tarjeta; en empleados crece de a 60ms pero el índice se calcula `i % 5`, así el escalonado se reinicia cada 5 elementos y no tarda demasiado con 9 personas. Respeta `prefers-reduced-motion` (todo visible de entrada, sin stagger).
- **Contenido en `data/equipo.ts`:** tipado (`Socio`, `Empleado`), con instrucciones al principio explicando que todo el contenido (nombres, cargos, bios, fotos) es de EJEMPLO. El campo `foto` es opcional en ambos tipos. Queda comentado, pensando en el modelo de Sanity, que "socios" y "empleados" probablemente terminen siendo un único tipo de documento "Persona" con un campo de tipo/booleano ("esSocio") en vez de dos arrays separados — es una decisión de la Fase 2 (modelo de Sanity), no se cambió la estructura ahora.
- **Navbar — link a Equipo:** se agregó "Equipo" a `navLinks` (`data/placeholders.ts`), apuntando a `/#equipo`, entre "Herramientas" y "Contacto" (el menú no replica el orden exacto de la home; se lo puso ahí por ser la posición más natural de navegación, junto a Contacto).
- **Navbar — fix de anchors cross-página:** este era un pendiente global que venía de la tarea de Contacto. Los 3 links de ancla del navbar ("Quiénes somos", "Equipo", "Contacto") pasaron de `<a href="#id">` a `<Link to="/#id">` (React Router) — el mecanismo de scroll a la sección ya existía (`hooks/useScrollToTop.ts`, soporta hash desde la tarea de Contacto) pero el Navbar todavía usaba anchors simples, que no navegan a la home si uno está parado en otra ruta (ej. `/comisiones`). No se tocó `useScrollToTop.ts`, solo cómo el Navbar arma esos tres links (ya no hacía falta un caso especial: como los 3 links no-dropdown del navbar son siempre internos, se cambió `<a>` por `<Link>` para los tres a la vez).
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión): desktop 1440px, tablet 800px y mobile 390px. Los 3 socios se ven con avatar placeholder (iniciales), nombre, cargo y bio; los 9 empleados en grilla (5/3/2 columnas según ancho verificado) con avatar, nombre y cargo, sin bio. La sección Equipo aparece en su posición correcta (después de Quiénes somos, antes de Contacto — verificado comparando `offsetTop` de las 3 secciones). El navbar muestra "Equipo" en desktop y en el acordeón mobile. Desde `/comisiones`, clickear "Quiénes somos", "Equipo" y "Contacto" navega a la home (URL con el hash correspondiente) y deja la sección en viewport, sin recargar la página (se confirmó dejando un marcador en `window` antes del click y comprobando que sobrevive después); estando ya en la home, los mismos tres links siguen scrolleando también sin recargar. Con "reducir animaciones" activado, la sección se ve completa de entrada. Sin scroll horizontal en mobile ni errores de consola en ninguna combinación. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** `data/equipo.ts`, `components/Equipo/Equipo.tsx` + `.module.css`.
**Archivos modificados:** `pages/Home.tsx` (monta `<Equipo/>` entre QuienesSomos y Contacto), `data/placeholders.ts` (agrega el link "Equipo" a `navLinks`; los hrefs de "Quiénes somos" y "Contacto" pasan de `#id` a `/#id`), `components/Navbar/Navbar.tsx` (los links no-dropdown pasan de `<a>` a `<Link>` de React Router).

**Decisiones propias / desvíos del brief:**
- El brief dejaba abierto dónde ubicar "Equipo" en el menú ("entre Quiénes somos y Contacto si el menú refleja ese orden, o donde tenga más sentido"); se lo puso pegado a "Contacto" (después de "Herramientas") en vez de justo después de "Quiénes somos", porque en el menú actual "Servicios" y "Herramientas" ya rompen el orden literal de la home (son dropdowns, no anclas) — mantener Equipo junto a los otros dos links de ancla (Quiénes somos/Contacto) hubiera separado visualmente algo que hoy ya no sigue ese criterio.
- No se creó ningún caso especial para diferenciar links de ancla de links a rutas dentro del Navbar: como hoy los 3 links no-dropdown (`Quiénes somos`/`Equipo`/`Contacto`) son siempre internos, se simplificó el `.map` para que todos usen `<Link>` en vez de mantener una rama con `<a>` que ya no hacía falta.

**Pendientes que quedaron abiertos:**
- **TODO(Agus):** fotos reales de las 12 personas (3 socios + 9 empleados), en orientación vertical 4:5.
- **TODO(Agus):** nómina real — nombres y cargos de las 12 personas.
- **TODO(Agus):** descripciones (bio) reales de los 3 socios, con años de mercado.
- Definir si hay un orden específico para mostrar a las personas dentro de cada bloque (socios y empleados) — hoy es simplemente el orden del array en `data/equipo.ts`, sin ningún criterio detrás.
- Sin conexión real a Sanity (`equipo.ts` queda tipado y listo para migrar, con la nota sobre el modelo "Persona" único).
- **Resuelto en esta tarea:** el pendiente global de los anchors `#quienes`/`#contacto` sin funcionar cross-página, que venía arrastrándose desde la tarea de Contacto (2026-09-22).


### 2026-09-22 — Página Informes (/informes)
- Se portó el prototipo aprobado (`__ref/BrioInformes.jsx`) a una página real, que reemplaza el "Próximamente" que había en `/informes`. Cuelga del menú Herramientas (ya estaba linkeada ahí desde la tarea del Navbar).
- **Diseño:** header (kicker + título + bajada, mismo patrón que Financiamiento PyME/Productos) + chips de filtro por categoría (mismo estilo visual que los chips de motivo de Contacto) + listado de informes (no es una grilla de tarjetas, es una lista con separadores). Cada ítem tiene: ícono genérico de documento (círculo teal, SVG inline), fecha en español (ej. "13 de julio de 2026"), badge de categoría, título, resumen y botón de descarga a la derecha. El listado siempre se muestra ordenado por fecha descendente (más nuevo arriba), sin importar el filtro activo — el orden se calcula en el componente, no depende de cómo esté cargado el array de datos. Si el filtro activo no tiene informes, se muestra el mensaje vacío (`emptyLabel`).
- **Contenido real:** el primer informe (`id: '1'`, semanal del 6 al 12 de julio) ya usa el PDF real que Santiago dejó en `src/assets/informes/informe-2026-07-13.pdf`, importado igual que se importan las fotos/logos en el resto del proyecto (así Vite lo empaqueta con hash y el link de descarga resuelve al archivo real, no a un string hardcodeado). Los otros tres informes (uno mensual, uno semanal y uno especial) son de EJEMPLO, tal cual el prototipo, con el botón de descarga apuntando a "#" — están para probar que el filtro por categoría funciona con más de un informe por categoría, no son contenido real.
- **Contenido en `data/informes.ts`:** tipado y con instrucciones al principio, mismo criterio que `productos.ts`/`financiamiento.ts`. Tres categorías (semanal, mensual, especial) — semanal es real, mensual y especial quedan con `TODO(Agus)` para confirmar si aplican o son solo de ejemplo. Queda comentado que en Sanity cada informe es un documento del modelo "Reporte" (título, fecha, archivo PDF, resumen opcional), documentado en el doc de contexto del proyecto.
- La aparición al scrollear reusa `useReveal.ts` (no se reescribió la lógica de IntersectionObserver del prototipo, que la simplifica por ser standalone). Respeta `prefers-reduced-motion`. El título de la página es h1 (es una página propia, no una sección).
- En celular el ícono del documento se oculta y el botón de descarga pasa a ancho completo, mismo criterio que el prototipo.
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión): escritorio 1440px y celular 390px. Los 4 informes se ven con fecha, categoría, título y resumen; el primero (real) muestra "13 de julio de 2026" y su link de descarga resuelve al PDF real empaquetado (no a "#"); los otros tres apuntan a "#" como corresponde. Filtrar por cada categoría muestra solo sus informes (semanal: 2, mensual: 1, especial: 1) y "Todos" muestra los 4, siempre en el mismo orden por fecha. Sin scroll horizontal en mobile, con el botón de descarga a ancho completo. Con "reducir animaciones" activado, todo se ve completo de entrada. Sin errores de consola. `tsc -b`, `eslint .` y `npm run build` corren limpios.

**Archivos creados:** `data/informes.ts`, `pages/Informes.tsx` + `.module.css`.
**Archivos modificados:** `App.tsx` (la ruta `/informes` pasa de placeholder `ComingSoon` a la página real; se sacó el import de `ComingSoon` porque ya no lo usa ninguna ruta).

**Decisiones propias / desvíos del brief:** ninguno relevante — se portó el prototipo tal cual, siguiendo el mismo patrón de organización (data separada del componente) que ya usa el resto de páginas propias del sitio.

**Pendientes que quedaron abiertos:**
- **TODO(Agus):** confirmar si las categorías "mensual" y "especial" aplican tal cual están o hay que ajustarlas/sacarlas — hoy son de ejemplo, solo "semanal" tiene contenido real.
- Solo el primer informe es contenido real; los otros tres son de ejemplo para mostrar el filtro funcionando y hay que reemplazarlos por informes reales (o borrarlos) cuando Brio tenga más PDFs para publicar.
- Sin conexión real a Sanity (`informes.ts` queda tipado y listo para migrar al modelo "Reporte").


### 2026-09-22 — Footer + Código de conducta + Términos y condiciones + datos reales de contacto
- Se cierra toda la etapa de home + legales base. Cuatro piezas en una misma tarea: Footer institucional, dos páginas legales nuevas y la sincronización de los datos reales de contacto que ya estaban confirmados.
- **Footer:** el prototipo de referencia mencionado en el brief (`BrioFooter.jsx`) no estaba en `__ref/` ni se encontró en ningún otro lado del entorno — se armó directo a partir de la descripción detallada del brief (estructura de 4 columnas, contenido exacto) en vez de portar un archivo, siguiendo el mismo criterio visual que el resto del sitio (Navbar/Contacto: mismos tokens de color, misma tipografía, mismo estilo de íconos SVG inline). Contenido en `data/footer.ts`: logo real (`logo-brio-blanco.svg`, el mismo que usa el Navbar), columna Contacto (teléfono/email reales), columna Dirección (Córdoba 1464 Piso 4, Rosario, dato real), columna Seguinos (5 redes: YouTube/Facebook/X reales, Instagram/LinkedIn con `TODO(Agus)`), franja legal (razón social + registro CNV + credenciales + los 2 links legales) y copyright con año calculado en runtime (`new Date().getFullYear()`). 4 columnas en desktop, 2 en tablet, 1 en mobile chico (solo CSS). Se monta en `App.tsx`, fuera de `<Routes>` junto al Navbar, así aparece en todas las páginas del sitio (no solo en la home) — el brief lo pedía de dos formas a la vez ("montar en Home.tsx al final" y "va fuera de Routes, en todas las páginas"); se priorizó la segunda por ser la más específica y porque monta una sola vez sin duplicar el footer, y visualmente el resultado es el mismo (Contacto sigue siendo la última sección de la home, el Footer queda inmediatamente después en el DOM).
- **Código de conducta (`/codigo-de-conducta`):** es el texto legal real de Brio, reproducido completo y sin resumir, con los 5 capítulos y toda la numeración de artículos tal cual el original (incluyendo el título duplicado de los Capítulos II y III, que así está en el documento fuente). Contenido en `data/legal.ts` (`codigoConducta`), modelado como capítulos → bloques, donde un bloque es un párrafo simple o un párrafo que introduce una lista (los artículos 4.2/4.4/4.6/4.7 tienen viñetas; 4.4 y 4.6 además tienen sub-viñetas anidadas — incisos b.1/b.2/b.3 y c.1/c.2/d.1/d.2 — que se renderizan como `<ul>` anidado en vez de meter los incisos como texto plano dentro de un solo párrafo). Formato sobrio: capítulos en h2, artículos en párrafos normales, sin tarjetas ni iconitos, con firma final (Carlos Alberto Rodríguez Ansaldi, Presidente del Directorio).
- **Términos y condiciones (`/terminos-y-condiciones`):** borrador genérico (no es texto real de Brio), con un `TODO(Agus/asesoría legal)` bien visible al principio de `data/legal.ts` avisando que hay que reemplazarlo por el texto definitivo antes de publicar. 10 secciones numeradas + línea de cierre institucional.
- **Estilos compartidos:** ambas páginas legales usan el mismo `pages/LegalDoc.module.css` en vez de duplicar CSS (tal como sugería el brief) — mismo fondo navy, mismo ancho de columna (720px, para que la lectura de textos largos no se estire de punta a punta de la pantalla), mismo link "Volver al inicio" arriba y abajo. Aparición simple con un fade de la página completa al entrar (sin escalonar nada, no usa `useReveal.ts`: es contenido estático, no tiene sentido animar por scroll un documento legal), respeta `prefers-reduced-motion`.
- **Datos reales de contacto:** se actualizó `data/contacto.ts` con los mismos datos reales que ya tiene `footer.ts` (email `info@briovalores.com`, teléfono `+54 (341) 5275351/52`, dirección completa como `sub` del canal "Oficina"). Los canales WhatsApp y horario quedan con sus valores de ejemplo (`TODO(Agus)`, sin tocar), igual que Instagram/LinkedIn en ambos archivos (`footer.ts` y `contacto.ts`) — quedan con el mismo comentario `TODO(Agus)` en los dos lugares, sin unificarlos todavía en un solo archivo compartido (el brief lo dejaba como decisión futura).
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión): desktop 1440px y mobile 390px en las 7 rutas del sitio (home, comisiones, productos, financiamiento-pyme, informes, codigo-de-conducta, terminos-y-condiciones) — el Footer aparece al final en todas, sin scroll horizontal y sin errores de consola en ninguna combinación. Se probó la navegación real: click en "Código de conducta" y "Términos y condiciones" desde el Footer de la home lleva a cada página (5 capítulos detectados en Código de conducta, firma presente), y el link "Volver al inicio" (arriba y abajo de cada página legal) vuelve a `/`. Se revisó visualmente con capturas de pantalla el Footer (desktop y mobile) y ambas páginas legales, incluyendo el tramo con listas anidadas (4.4) para confirmar que el sub-bullet se ve distinguible del bullet principal. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** `data/footer.ts`, `data/legal.ts`, `components/Footer/Footer.tsx` + `.module.css`, `pages/CodigoConducta.tsx`, `pages/TerminosCondiciones.tsx`, `pages/LegalDoc.module.css`.
**Archivos modificados:** `App.tsx` (importa y monta `<Footer/>` fuera de `<Routes>`, agrega las rutas `/codigo-de-conducta` y `/terminos-y-condiciones`), `data/contacto.ts` (email/teléfono/dirección pasan a ser reales, comentarios TODO reordenados por canal).

**Decisiones propias / desvíos del brief:**
- El prototipo `BrioFooter.jsx` que menciona el brief no estaba disponible en `__ref/` ni se encontró en el resto del entorno (a diferencia de los demás prototipos ya portados, que sí estaban ahí) — se construyó el Footer directamente a partir de la descripción detallada del brief en vez de portar un archivo, con el mismo criterio visual que el resto del sitio ya construido. Si el archivo aparece más adelante, vale la pena cotejar contra él por si hay detalles de diseño que no estaban en la descripción escrita.
- Footer montado en `App.tsx` (fuera de `<Routes>`) en vez de dentro de `Home.tsx`: el brief pedía las dos cosas en simultáneo, y son mutuamente excluyentes si no se quiere duplicar el footer o dejarlo fuera de las demás páginas. Se priorizó que aparezca en todo el sitio (el requisito más específico y el que más valor aporta), sin perder el efecto visual pedido (queda igual, último, después de Contacto).
- Las sub-viñetas de los artículos 4.4 y 4.6 del Código de Conducta (incisos b.1/b.2/b.3, c.1/c.2, d.1/d.2) se modelaron como una lista anidada tipada (`LegalListItem.sub`) en vez de dejarlas como texto plano dentro del párrafo — el contenido normativo es idéntico, solo cambia que se renderiza como `<ul>` anidado real en vez de guiones sueltos dentro de un bloque de texto, más legible y accesible.
- Se armó `data/legal.ts` como archivo de datos para las dos páginas legales (en vez de hardcodear el texto directo en los componentes), siguiendo el mismo patrón que el resto del sitio (`contacto.ts`, `productos.ts`, `financiamiento.ts`) — el brief mencionaba explícitamente "el archivo de datos" al pedir el TODO de Términos y condiciones, lo que ya sugería esta estructura.
- Título de los Capítulos II y III del Código de Conducta: en el documento original ambos capítulos se llaman igual ("Normas e Instructivos para la apertura de cuentas"), aunque el contenido de uno y otro es distinto. Se dejó tal cual, sin corregir, porque es el texto real de un documento legal de la empresa y no corresponde "arreglar" una inconsistencia del original sin que Brio lo confirme.

**Pendientes que quedaron abiertos:**
- **TODO(Agus):** confirmar los links reales de Instagram y LinkedIn (footer y sección Contacto de la home) — hoy son placeholder en los dos archivos.
- **TODO(Agus/asesoría legal):** Términos y condiciones es un borrador genérico armado para lanzar el sitio; falta que la asesoría legal de Brio lo revise y lo reemplace por el texto definitivo antes de darlo por cerrado.
- Cotejar el Footer contra `BrioFooter.jsx` si ese prototipo aparece más adelante (no estaba disponible en este entorno al hacer esta tarea).
- Siguen de ejemplo (sin cambios en esta tarea): número de WhatsApp y horario de atención en `data/contacto.ts`.
- Sin conexión real a Sanity — `footer.ts` y `legal.ts` quedan tipados y listos para migrar.


### 2026-09-22 — Sección Contacto (home) + anchors cross-página + envío por mail
- Se portó el prototipo aprobado (`__ref/BrioContacto.jsx`) a la sección Contacto real, montada al final de la home (debajo de Quiénes somos, con ancla `#contacto`). Es la última sección que faltaba de esta etapa de la home (Equipo queda para después, sin que Contacto tenga que moverse).
- **Diseño:** dos columnas en desktop (izq: sello CNV + título + bajada + 5 canales de contacto con ícono + redes sociales; der: formulario en tarjeta glass), apiladas en mobile. Igual que las demás secciones, reusa `useReveal.ts` para la aparición al scrollear (el prototipo trae su propio hook local solo porque es standalone).
- **Formulario:** controlado con React state — motivo (3 chips: Abrir mi cuenta / Financiamiento para mi PyME / Otra consulta), nombre, email, teléfono, empresa (solo si el motivo es "pyme") y mensaje. Valida al enviar (nombre no vacío, email con regex simple, mensaje de al menos 5 caracteres), con errores en línea (`aria-invalid` + `aria-describedby`). Tiene un campo honeypot oculto (`website`): si un bot lo completa, el envío se cancela en silencio, sin mostrar error. Cuatro estados (idle/sending/sent/error): al enviar bien, el form se reemplaza por un bloque de éxito con botón para mandar otra consulta; si falla, aparece un mensaje de error general arriba del botón. Respeta `prefers-reduced-motion` (sin animación de entrada ni la del campo "empresa" al aparecer).
- **Contenido:** todo vive en `data/contacto.ts` (motivos, textos de campos, mensajes de éxito/error, canales, redes, sello), tipado y con instrucciones al principio, igual que `financiamiento.ts`/`productos.ts`. Los 5 canales (WhatsApp, email, teléfono, oficina, horario) y las 2 redes (Instagram, LinkedIn) son datos de EJEMPLO, marcados `TODO(Agus)`.
- **Envío real:** se creó `api/contacto.ts`, función serverless de Vercel que recibe el POST del formulario, valida los mismos tres campos del lado del servidor (nunca confiar solo en el cliente), respeta el honeypot (si viene lleno, responde 200 sin mandar nada, para no delatarle al bot que fue detectado) y manda el mail con Resend (`npm install resend`). El asunto se arma con el motivo (ej. "Nueva consulta — Financiamiento PyME") y el `reply-to` queda en el mail de quien escribió, para poder responder directo. Lee `RESEND_API_KEY` y `CONTACTO_DESTINATARIO` de variables de entorno (nunca hardcodeadas) — quedan documentadas en `.env.example`, sin valores reales.
- **Motivo por URL + anchors cross-página:** los dos botones "Consultá por tu PyME" de Financiamiento PyME ahora navegan a `/?motivo=pyme#contacto` (antes iban a `#contacto`, que no llevaba a ningún lado porque Contacto no existía). El componente Contacto lee el query param `motivo` con `useSearchParams` al montarse y, si matchea un motivo válido, lo preselecciona; si no, arranca en "Abrir mi cuenta" como antes. Para que esto funcione se reescribió `hooks/useScrollToTop.ts`: antes siempre hacía `scrollTo(0,0)` en cada cambio de ruta, lo que rompía cualquier link con hash. Ahora, si la navegación no trae hash sigue yendo a (0,0) como siempre; si trae hash, espera (con reintentos por `requestAnimationFrame`, con tope) a que el elemento exista en el DOM y hace `scrollIntoView` — sirve tanto para el CTA de Financiamiento PyME como para los anchors del navbar (`#quienes`, `#contacto`) estando parado en otra ruta.
- **Bug real encontrado y corregido durante la verificación:** al portar el prototipo, cada columna (izq/derecha) llamaba a `useReveal` por separado con el ref puesto directo sobre el propio bloque a revelar. Pero `useReveal.ts` busca la clase de reveal entre los *descendientes* del elemento con el ref, no en el elemento mismo — con esa marcación, la aparición nunca se disparaba (con movimiento normal la sección quedaba en `opacity:0` para siempre; solo se veía con "reducir animaciones" activado, porque ese caso lo resuelve el CSS solo). Se corrigió para usar un único `useReveal` con el ref en la sección completa, igual que en Quiénes somos y Financiamiento PyME. Se verificó con Playwright chequeando `opacity` computado antes y después del fix.
- Se verificó con Playwright (Chromium headless): escritorio 1440px y celular 390px, sin scroll horizontal ni errores de consola. Formulario completo con datos de prueba (interceptando `/api/contacto` para no depender de tener `RESEND_API_KEY` configurada en este entorno) → aparece el estado de éxito y el botón "Enviar otra consulta" vuelve al formulario vacío; respuesta simulada de error → aparece el mensaje general de error. Envío vacío → los 3 errores en línea. Honeypot completado a la fuerza (simulando un bot) → no se llama al endpoint y no se muestra ningún error. Click en "Consultá por tu PyME" desde `/servicios/financiamiento-pyme` → navega a `/?motivo=pyme#contacto`, hace scroll hasta la sección y deja el chip "Financiamiento para mi PyME" preseleccionado con el campo "Nombre de la empresa" visible. Navegación directa a `/#quienes` desde otra ruta → scrollea correctamente a Quiénes somos (verificado así, "simulado", tal como preveía el brief, ya que el propio link del navbar a `#quienes` sigue sin actualizarse — ver pendientes). Navegar a una ruta sin hash sigue reseteando el scroll a 0. Con "reducir animaciones" activado, la sección se ve completa de entrada. `tsc -b`, `eslint .` y `npm run build` corren limpios.

**Archivos creados:** `data/contacto.ts`, `components/Contacto/Contacto.tsx` + `.module.css`, `api/contacto.ts`, `tsconfig.api.json`, `.env.example`.
**Archivos modificados:** `pages/Home.tsx` (monta `<Contacto/>`), `data/financiamiento.ts` (el href del CTA pasa de `#contacto` a `/?motivo=pyme#contacto`), `pages/FinanciamientoPyme.tsx` (el CTA pasa de `<a>` a `<Link>` de React Router, para navegar sin recargar la página), `hooks/useScrollToTop.ts` (reescrito para soportar hash), `tsconfig.json` (referencia al proyecto nuevo `tsconfig.api.json`), `eslint.config.js` (globals de Node para `api/`, en vez de los de browser), `package.json`/`package-lock.json` (se agrega `resend`), `.gitignore` (se suman `.env`/`.env.local`/`.env.*.local`, antes solo estaba cubierto a medias por `*.local`).

**Decisiones propias / desvíos del brief:**
- El componente `Contacto.tsx` importa `contacto` directo de `data/contacto.ts` en vez de recibir ~20 props desde `Home.tsx`. Es distinto del patrón de Hero/Servicios/QuienesSomos (que sí reciben props), pero igual al que ya usan `Productos.tsx`/`FinanciamientoPyme.tsx` para sus propios datos — con un objeto tan anidado como `contacto`, forzarlo a props hubiera sido puro ruido.
- El CTA de Financiamiento PyME pasó de `<a href="#contacto">` a `<Link to="/?motivo=pyme#contacto">` (React Router) en vez de quedar como `<a>` con navegación dura. Con `<a>` funcionaba igual (recarga completa de la página), pero `<Link>` es más consistente con el resto del sitio, que ya usa React Router para toda navegación interna, y evita el parpadeo de una recarga completa.
- `api/contacto.ts` recibe también el campo `website` (honeypot) en el body, aunque el brief solo lista `{ motivo, nombre, email, telefono, empresa, mensaje }` como lo que recibe la función — hace falta para poder validar el honeypot del lado del servidor tal como pide el mismo brief un párrafo después (si alguien le pega directo al endpoint sin pasar por el formulario, saltándose el chequeo del cliente).
- El remitente (`from`) del mail está hardcodeado al dominio de pruebas de Resend (`onboarding@resend.dev`), con un TODO(Agus) en el código: para mandar desde un mail propio de Brio hay que verificar el dominio en Resend primero, y hoy no tenemos ese dato.
- Se armó un proyecto de TypeScript aparte (`tsconfig.api.json`) solo para `api/`, con tipos de Node en vez de browser, y un ajuste chico en `eslint.config.js` a tono (si no, `process.env` tiraba error de lint porque todo el proyecto asume entorno de navegador). No se agregó `@vercel/node` como dependencia: la función usa la firma clásica de Node (`req`/`res`) tipada a mano con lo mínimo que se usa, para no sumar una dependencia solo por los tipos.
- La lista de labels de motivos (`MOTIVO_LABELS`) está duplicada en `api/contacto.ts` en vez de importada de `data/contacto.ts`: el endpoint corre aislado del bundle del front, y evita depender de la resolución de módulos cruzada entre `api/` y `src/`. Queda comentado en el código que hay que mantenerlas sincronizadas a mano si se edita un motivo.

**Pendientes que quedaron abiertos:**
- **Configurar en Vercel** las variables `RESEND_API_KEY` (cuenta de Resend) y `CONTACTO_DESTINATARIO` (mail real de Brio) — sin esto, el formulario no manda mails de verdad (responde error de forma controlada, no rompe).
- **TODO(Agus):** confirmar los datos reales de los 5 canales de contacto (WhatsApp, email, teléfono, oficina, horario) y de las 2 redes sociales — hoy todos son de ejemplo.
- **TODO(Agus):** el remitente del mail (`from`) usa el dominio de pruebas de Resend; hay que verificar un dominio propio de Brio en Resend y cambiarlo ahí.
- Los links del navbar a `#quienes` y `#contacto` (en `data/placeholders.ts` → `navLinks`) siguen siendo anchors simples (`#quienes`, no `/#quienes`): el mecanismo de scroll cross-página ya está listo (`useScrollToTop.ts`), pero el navbar todavía no lo usa — clickear "Quiénes somos" o "Contacto" estando parado en otra ruta (ej. `/comisiones`) todavía no navega a la home. Es un cambio chico (actualizar esos dos `href` a `/#quienes` / `/#contacto`, o pasar esos dos links a `<Link>`), pero quedó fuera del alcance de esta tarea.
- Sin conexión real a Sanity (`contacto.ts` ya queda tipado y listo).


- Agus confirmó que Brio opera CEDEARs y ADRs, así que la categoría "Renta variable" de la página de Productos pasó de tener un solo instrumento a tener tres: Acciones (BYMA) (tal cual estaba), CEDEARs ("Comprá en pesos partes de empresas del exterior, como Apple o Tesla.") y ADRs ("Acciones argentinas que cotizan en el mercado de Estados Unidos.").
- Es un cambio solo de contenido, en `data/productos.ts`. No se tocó el diseño, el carrusel ni las otras categorías (Renta fija, Financiamiento, Futuros y opciones). El slide de Renta variable simplemente muestra los tres en lista, igual que los otros slides con varios instrumentos.
- Se actualizó el comentario de pendientes al principio del archivo: ya no dice que falta confirmar CEDEARs, solo queda pendiente si se suman opciones.
- Se verificó en navegador (Chromium headless): en escritorio 1440px y en celular 390px el slide de Renta variable muestra los tres instrumentos con sus líneas, sin scroll horizontal y sin errores de consola. `tsc`, `eslint` y `npm run build` corren limpios y el servidor de desarrollo levanta sin errores.

**Archivos modificados:** `data/productos.ts` (dos instrumentos nuevos en Renta variable + comentario de pendientes).

**Decisiones propias / desvíos del brief:** ninguno.

**Pendientes que quedaron abiertos:** confirmar con Agus si Renta variable suma opciones (CEDEARs y ADRs ya quedaron resueltos). Sigue pendiente confirmar que Futuros y opciones va como categoría y el copy definitivo de las líneas explicativas.


### 2026-09-18 — Página Financiamiento PyME (/servicios/financiamiento-pyme)
- Se portó el prototipo aprobado (`BrioFinanciamientoPyme.jsx`) a una página real, que reemplaza el "Próximamente" que había en `/servicios/financiamiento-pyme`. Es la versión extendida de Financiamiento PyME, colgada del menú Servicios.
- Tiene los 4 bloques del prototipo: (1) intro con título, bajada (con "segmento avalado por una SGR" resaltado) y botón "Consultá por tu PyME"; (2) tres tarjetas de beneficios (cheques propios y de terceros / tasas de gran empresa con aval SGR / simple, transparente y seguro en MAV y BYMA); (3) paso a paso de 4 etapas; (4) cierre con el mismo botón.
- **Paso a paso:** en desktop es una tira horizontal, con los 4 números conectados por una línea teal detrás, que aparecen uno tras otro (escalonado) al scrollear. En celular se reordena a tira vertical: número a la izquierda, línea que baja conectándolos y el texto a la derecha. Los números 1 al 4 se muestran tal cual, porque es un proceso real.
- La aparición al scrollear reusa la pieza que ya existía (`useReveal`) y los colores y fuentes salen de `tokens.css` (no se duplicó nada). Con "reducir animaciones" activado en el sistema, todo se ve completo de entrada y sin movimiento.
- Todo el texto (encabezado, beneficios, pasos, cierre y el botón) vive en un archivo aparte, `data/financiamiento.ts`, tipado y con instrucciones al principio. Nada de texto hardcodeado en la página. Listo para pasar a Sanity más adelante.
- Los dos botones "Consultá por tu PyME" apuntan a `#contacto`. Como la sección Contacto todavía no existe, hoy el botón no lleva a ningún lado: es lo esperado y se activa solo cuando se construya Contacto (aplica la misma salvedad que ya teníamos con el menú, ver pendientes globales).
- No se menciona LEBAC en ningún texto de la página.
- Se verificó con Playwright (Chromium headless, sin instalar nada en el repo): escritorio 1440px, celular 390px y modo reducir animaciones. En desktop los 4 pasos entran escalonados y los números quedan alineados con la línea entre el primero y el último; en celular el número queda a la izquierda y el texto a la derecha, sin scroll horizontal; con reducir animaciones todo es visible desde el primer momento. Sin errores de consola. `tsc`, `eslint` y `npm run build` corren limpios.

**Archivos creados:** `pages/FinanciamientoPyme.tsx` + `.module.css`, `data/financiamiento.ts`.
**Archivos modificados:** `App.tsx` (la ruta `/servicios/financiamiento-pyme` pasa de placeholder a la página real; el resto del router no se tocó).

**Decisiones propias / desvíos del brief:**
- **Línea del paso a paso en celular:** en el prototipo la línea vertical era una sola, de alto fijo, y sobraba un pedazo colgando por debajo del número 4 (porque el último paso tiene más texto). Acá la línea se arma como un tramo entre cada par de números, así empieza en el 1 y termina justo en el 4. Se ve igual que el prototipo salvo por ese detalle, y la línea completa del desktop no cambió.
- Los títulos de las 3 tarjetas de beneficios pasaron de h3 a h2 (el prototipo saltaba del título principal directo a h3), para que la jerarquía de la página sea correcta para lectores de pantalla y buscadores. Visualmente no cambia nada.
- La bajada se guarda en tres partes en `financiamiento.ts` (antes / frase destacada / después) para poder resaltar "segmento avalado por una SGR" sin meter formato dentro del dato.
- La tira del paso a paso está pensada para exactamente 4 etapas: si algún día hay que sumar o quitar una, hay que tocar también los estilos (queda avisado en el archivo de datos).

**Pendientes que quedaron abiertos:**
- Los textos son provisorios (los repasa Agus).
- Los botones "Consultá por tu PyME" no llevan a nada hasta que exista la sección Contacto en la home.
- Sin conexión real a Sanity (solo queda `financiamiento.ts` tipado y listo).


### 2026-09-18 — Página Productos (/servicios/productos)
- Se portó el prototipo aprobado (`BrioProductos.jsx`) a una página real, que reemplaza el "Próximamente" que había en `/servicios/productos`. Es un carrusel de instrumentos agrupados en 4 categorías: Renta fija, Renta variable, Financiamiento y Futuros y opciones. Sin mercado internacional.
- Cómo se comporta: pestañas arriba (una por categoría), una banda de progreso de teal a naranja arriba del slide que al llenarse pasa sola a la categoría siguiente, flechas anterior/siguiente y puntitos abajo. Al pasar el mouse por encima del carrusel se frena. Al cambiar de slide entra deslizando de costado y los instrumentos aparecen uno tras otro. Cada slide tiene su ilustración abstracta (dibujada en código, no imágenes), una frase y la lista de instrumentos con su línea explicativa.
- La aparición al scrollear reusa la pieza que ya existía (`useReveal`), con la misma entrada escalonada del prototipo (título, pestañas, carrusel, puntitos).
- Todo el contenido (categorías, instrumentos, líneas, frases y textos del encabezado) vive en un archivo aparte, `data/productos.ts`, tipado y con instrucciones al principio: sumar un instrumento es agregar una línea en su categoría; sacar una categoría entera es borrar su bloque (pestañas, puntitos y carrusel se ajustan solos). Nada de texto hardcodeado en la página. Listo para pasar a Sanity más adelante.
- Celular: la ilustración pasa arriba y todo se apila, sin flechas. Con "reducir animaciones" activado en el sistema no hay avance automático ni animaciones y el contenido se ve completo desde el principio.
- Se verificó con Playwright (Chromium headless, instalado ad-hoc fuera del repo): escritorio 1440px, celular 390px y modo reducir animaciones. Las 4 pestañas, las flechas y los puntitos cambian de categoría; el avance automático salta a los ~5 segundos; con el mouse encima la banda y el avance quedan quietos y al sacar el mouse retoman; en celular no hay flechas ni scroll horizontal y la ilustración queda arriba; con reducir animaciones no avanza solo y todo es visible. Sin errores de consola. `tsc`, `eslint` y `npm run build` corren limpios.

**Archivos creados:** `pages/Productos.tsx` + `.module.css`, `data/productos.ts`.
**Archivos modificados:** `App.tsx` (la ruta `/servicios/productos` pasa de placeholder a la página real).

**Decisiones propias / desvíos del brief:**
- **La banda de progreso ahora manda el avance.** En el prototipo, el avance automático y la banda eran dos relojes separados: al pasar el mouse se frenaba el avance pero la banda seguía llenándose y quedaba llena y trabada, y después de sacar el mouse quedaba desfasada. Acá la banda ES el reloj: cuando termina de llenarse, pasa a la siguiente. Así nunca se desfasan, y al frenar con el mouse la banda queda quieta donde estaba y retoma desde ahí. Visualmente es lo mismo que el prototipo, pero sin ese defecto.
- La pausa por mouse aplica solo con mouse real, no con toque: en celular, tocar dejaba el carrusel frenado para siempre.
- Con "reducir animaciones" la banda directamente se oculta (en el prototipo quedaba una barra vacía sin sentido).
- Los colores de las ilustraciones usan las variables de marca (`tokens.css`) en vez de repetir los códigos de color, como pedía el brief de no duplicar tokens. Se comprobó que se ven igual.
- El título de la página es el título principal (h1) en vez de h2, porque ahora es una página propia, no una sección.
- En Renta fija el instrumento se llama "LECAPs" como en la lista del brief; el prototipo decía "LECAPs / Letras". Es un cambio de una línea en `productos.ts` si prefieren la otra versión.
- Los puntitos dejaron de declararse como pestañas (el prototipo los marcaba así sin serlo) y ahora indican cuál es el actual.

**Pendientes que quedaron abiertos:**
- Confirmar con Agus: si Renta variable suma CEDEARs u opciones (hoy solo Acciones, por eso esa categoría tiene un único ítem) y si Futuros y opciones va como categoría.
- Las líneas explicativas y las frases de cada categoría son provisorias (copy definitivo por confirmar).
- Las ilustraciones son abstractas y provisorias; se pueden reemplazar por arte real más adelante. Una categoría nueva que se agregue en `productos.ts` muestra una ilustración genérica hasta que se le dibuje una propia.
- Sin conexión real a Sanity (solo queda `productos.ts` tipado y listo).


### 2026-09-17 — Navbar: dropdowns, sticky y logo real
- Se cerraron los 3 pendientes que arrastraba el header desde la tarea de Navbar + Hero: la flechita decorativa de los dropdowns, la falta de sticky y el wordmark de texto en lugar del logo.
- **Menú nuevo:** "Quiénes somos" y "Contacto" siguen siendo anclas a la home. "Servicios" y "Herramientas" dejaron de ser links directos y pasaron a ser disparadores de dropdown puro (ya no llevan a ningún lado por sí mismos, solo abren su lista).
  - Dropdown "Servicios": Financiamiento PyME y Productos, cada uno a su propia ruta nueva (`/servicios/financiamiento-pyme`, `/servicios/productos`), hoy con página placeholder.
  - Dropdown "Herramientas": Comisiones (ya existía, ahora enlazada desde acá), Informes (ruta nueva con placeholder), Consulta de Portafolio (link externo a Irmo, pestaña nueva), Panel de cotizaciones y Renta fija (deshabilitados, con etiqueta "Próximamente", sin link).
  - "Mi Portafolio" pasó de ancla muerta a link externo real (virtualbroker-brio.aunesa.com), en pestaña nueva, con indicador ↗. "Abrí tu cuenta" no se tocó.
- **Dropdowns funcionales:** abren con hover en desktop (CSS puro) y con click/tap en cualquier tamaño (estado en React, también sirve para teclado vía Enter/Espacio sobre el botón). Cierran solos al clickear afuera, con Escape, o al navegar. En mobile se integran como acordeón adentro del panel de la hamburguesa (no como flotante), separado del comportamiento hover de escritorio.
  - Bug real encontrado y corregido durante la verificación: la regla CSS que evitaba que el dropdown quedara "pegado" abierto por :focus-within en desktop tenía más especificidad que la clase de abierto por click, así que en mobile el acordeón se abría "vacío" (el panel ocupaba el alto pero el contenido quedaba con opacity:0) porque tocar el botón lo deja enfocado y esa regla ganaba. Se sacó esa regla del bloque mobile: ahí no hace falta, el foco real coincide con el estado que ya queremos (abierto).
- **Sticky:** el header usa `position: sticky` (no hace falta compensar layout) y cambia de fondo a `--navy-sticky` con sombra pasados 40px de scroll, con transición suave. Se agregó `scroll-padding-top` global para que saltar a `#quienes`/`#contacto` no quede tapado por el header pegado arriba.
- **Logo real:** se reemplazó el wordmark de texto por `logo-brio-blanco.svg` (ya estaba en `assets/`), como `<img>` con alto fijo por clamp y ancho automático (sin deformar), linkeado a `/` con React Router. La versión color queda sin usar, disponible para otras partes del sitio (ej. footer).
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión, no es dependencia del repo): desktop 1440px y mobile 390px — hover y click abren/cierran los dropdowns de Servicios y Herramientas, el ítem deshabilitado no es un link (`<span>`, no `<a>`), clickear afuera cierra el dropdown, el acordeón mobile muestra sus ítems, el sticky cambia el fondo al scrollear, las 3 rutas placeholder responden con su "Próximamente", y los links externos (Mi Portafolio, Consulta de Portafolio) tienen la URL y `target="_blank"` correctos. Sin errores de consola. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** `pages/ComingSoon.tsx`.
**Archivos modificados:** `components/Navbar/Navbar.tsx` (reescrito: dropdowns, sticky, logo, cierre por click-afuera/Escape), `components/Navbar/Navbar.module.css` (mismos agregados), `data/placeholders.ts` (tipos `NavDropdownItem`/`NavLinkItem` nuevos, `navLinks` con la estructura de dropdown, `brand` pasa a solo `logoAlt`, `navActions.portfolioHref` ahora es la URL externa real), `App.tsx` (props del Navbar actualizadas, rutas placeholder agregadas), `index.css` (`scroll-padding-top` para compensar el sticky).

**Decisiones propias / desvíos del brief:**
- El brief no especificaba si "Servicios" y "Herramientas" debían seguir siendo también un link además de disparar el dropdown; se optó por que sean puramente disparadores (sin href propio), porque no hay una sección `#servicios` genérica a la que tenga sentido mandar y evita el caso raro de "click abre Y navega a la vez".
- Un solo dropdown abierto a la vez (abrir uno cierra el otro) — no estaba pedido explícitamente, es el comportamiento estándar y evita que queden dos paneles superpuestos.
- Se creó `pages/ComingSoon.tsx` como componente reutilizable (recibe el título por prop) en vez de 3 archivos casi idénticos, para las 3 rutas placeholder — mismo resultado visual que pedía el brief (`<div>Próximamente</div>`), menos repetición.

**Pendientes que quedaron abiertos:** ninguno nuevo de esta tarea. Los anchors `#quienes`/`#contacto` siguen sin andar cross-página (ver pendientes globales) — no se tocó, seguía fuera de este alcance.


### 2026-09-15 — Servicios: copy real de los 3 pilares
- Se reemplazaron las 3 descripciones placeholder de `servicePillars` (en `data/placeholders.ts`) por el texto real rescatado del sitio anterior de Brio, adaptado a largo de tarjeta. Títulos, orden, destaque de "Financiamiento PyME" y el resto de la sección (instrumentos, comisiones) no se tocaron.
- Se sacó el comentario `TODO(Agus): confirmar frases definitivas de cada pilar` que ya no aplica.
- Se verificó explícitamente que no quedó mención a LEBAC (no existen desde 2018).
- `npm run dev` levanta sin errores.

**Archivos modificados:** `data/placeholders.ts` (solo el campo `text` de los 3 objetos en `servicePillars`).

**Decisiones propias / desvíos del brief:** ninguno.

**Pendientes que quedaron abiertos:** el "paso a paso" de CPD para el pilar de Financiamiento PyME queda pendiente, es una decisión de diseño aparte (no se tocó en esta tarea). El listado fino de instrumentos (Nivel 2) tampoco se tocó, según lo pedido.


### 2026-09-14 — Quiénes somos: se saca el bloque de números y entra la foto real
- Decisión de la clienta: no se muestran números en Quiénes somos. Se eliminó por completo el bloque de contadores (los 4 números / sello "Mat. 512") y quedó la sección en 2 bloques: relato (con foto) + valores.
- Se sacó todo lo que era solo para ese bloque: el array `quienesStats` y el tipo `QuienesStat` de `placeholders.ts`, el componente `Counter` y su `IntersectionObserver` propio de `QuienesSomos.tsx`, y los estilos correspondientes del `.module.css`.
- Se puso la foto real de oficina (`src/assets/oficina-quienes.jpeg`) en el lugar del placeholder del relato, con el mismo marco que ya tenía el hueco (bordes redondeados, proporción horizontal 4:3, recorte sin deformar). Sigue apareciendo al scrollear igual que el resto de la sección.
- `npm run lint` y `npm run build` corren limpios, sin warnings.

**Archivos modificados:** `components/QuienesSomos/QuienesSomos.tsx`, `components/QuienesSomos/QuienesSomos.module.css`, `data/placeholders.ts` (sacó `QuienesStat`/`quienesStats`, foto pasó de placeholder a alt real), `pages/Home.tsx` (dejó de pasar `stats`).

**Decisiones propias / desvíos del brief:** el archivo de la foto que había en `src/assets/` se llama `oficina-quienes.jpeg` (no `.jpg` como decía el brief) — se usó el nombre real del archivo.

**Pendientes que quedaron abiertos:** ninguno nuevo de esta tarea — el relato de texto y las tarjetas de valores siguen siendo contenido provisorio (ver pendientes globales).


### 2026-09-14 — Routing + página /comisiones
- Se instaló `react-router-dom` y se envolvió la app en `<BrowserRouter>` (`main.tsx`). Primera vez que el sitio tiene routing.
- Se sacó Hero + Servicios + QuienesSomos de `App.tsx` a `pages/Home.tsx`. `App.tsx` ahora monta `<Navbar/>` siempre (fuera de `<Routes>`) y define las rutas `"/"` → `Home` y `"/comisiones"` → `Comisiones`.
- Comisiones dejó de ser una tabla placeholder dentro de Servicios y pasa a página propia (`pages/Comisiones.tsx` + `.module.css`), con todas las tablas del PDF "Comisiones al 01-01-2026" (queda en `__ref/`, valores cruzados y verbatim: %, "+ IVA", $, USD y asteriscos de prorrateo tal cual el PDF, sin redondear).
- Datos en `data/comisiones.ts` (archivo nuevo, aparte de `placeholders.ts`): cada tabla es `{ titulo, columnas[], filas[][], notas?[] }` — el componente banca columnas variables (algunas tablas tienen 3 columnas, otras 4 o 5).
- La página se organiza en 5 pestañas para no hacer un muro infinito: Buenos Aires, Rosario, A3 / Rofex, Exterior (Plaza EEUU + Dividendos EEUU), Custodia y rentas (Custodia de títulos + Rentas + Dividendos $/USD + Dividendos en acciones). En mobile cada tabla pasa a formato tarjeta con etiquetas, mismo patrón que ya se usaba en la vieja tabla de Servicios.
- En Servicios, la tabla vieja se reemplazó por una tarjeta con `feesLead` + `<Link to="/comisiones">` ("Ver comisiones completas →"). Se actualizó `placeholders.ts`: se sacó `FeeRow`/`feeRows`/`feesNote`, quedó `feesLead` + `feesCtaLabel`.
- **Bug real encontrado y corregido**: React Router no resetea el scroll al navegar entre rutas. Como el CTA de Servicios vive lejos del tope de la home, al clickearlo la página de Comisiones quedaba montada con el scroll heredado (ej. y=479) — el encabezado y las pestañas, que usan `useReveal` (fade-in al entrar en viewport), quedaban arriba del viewport y nunca se revelaban: la página se veía en blanco hasta que el usuario scrolleaba a mano. Se agregó `hooks/useScrollToTop.ts` (usa `useLocation`, hace `window.scrollTo(0,0)` en cada cambio de `pathname`) y se invoca en `App.tsx`. Verificado con Playwright: antes del fix `.head` quedaba con opacity 0 y sin la clase `isIn`; después, `scrollY` vuelve a 0 y el header se revela normal en ambos casos (navegación por click y carga directa de `/comisiones`).
- Se verificó con Playwright (Chromium headless, instalado ad-hoc en el scratchpad de la sesión — no quedó como dependencia del repo): desktop 1440px y mobile 390px, click en el CTA, las 5 pestañas cambian correctamente las tablas (se listaron los títulos de tabla por pestaña y se comparó una fila puntual contra el PDF), formato tarjeta en mobile, sin errores de consola. `npx tsc -b`, `npx eslint .` y `npm run build` corren limpios.

**Archivos creados:** `pages/Home.tsx`, `pages/Comisiones.tsx` + `.module.css`, `data/comisiones.ts`, `hooks/useScrollToTop.ts`.
**Archivos modificados:** `main.tsx` (BrowserRouter), `App.tsx` (Navbar + Routes + useScrollToTop), `components/Servicios/Servicios.tsx` + `.module.css` (CTA en vez de tabla), `data/placeholders.ts` (sacó `FeeRow`/`feeRows`/`feesNote`, agregó `feesLead`/`feesCtaLabel`).

**Decisiones propias / desvíos del brief:**
- El fix de scroll-to-top en cambio de ruta no estaba pedido explícitamente, pero es standard al introducir React Router por primera vez y sin él la página de comisiones se veía rota (ver bug arriba) — se agregó por necesidad, no por scope creep.
- Se agregaron las filas "Comisión Caja de Valores" en Rentas / Dividendos $ y USD / Dividendos en acciones: están en el PDF fuente aunque el brief no las transcribió explícitamente en el texto de la tarea.
- Las tablas de "Custodia de títulos" (un solo dato: mantenimiento mensual) y "Dividendos en acciones" se modelaron con el mismo tipo `FeeTable` genérico (columnas ad-hoc: "Mantenimiento de cuenta" / "Arancel" y "Rango" / "Arancel" respectivamente) para no crear un tipo aparte — no hay pérdida de información, solo se adaptó el nombre de columna al contenido real de cada bloque del PDF.

**Pendientes que quedaron abiertos:**
- Los anchors del navbar (`#servicios`, `#quienes`) no se ajustaron todavía para funcionar cross-página (ej. clickear "Servicios" estando en `/comisiones`): sigue pendiente del dropdown funcional del header, tal como pedía el brief ("no romper nada").
- No hay link a "Comisiones" en el navbar todavía (dropdown de Servicios + Comisiones sigue pendiente, fuera de scope de esta tarea).
- Sin conexión real a Sanity — `comisiones.ts` queda tipado y listo para migrar.


### 2026-09-14 — Sección Quiénes somos
- Se portó el prototipo aprobado (`BrioQuienesSomos.jsx`) a un componente tipado, montado debajo de Servicios en la home, con ancla `#quienes`.
- Tres bloques: (1) relato en 2 columnas (texto + placeholder de foto de oficina), (2) 4 números (3 contadores que cuentan hacia arriba + el sello estático "Mat. 512 / Registrado en CNV"), (3) 4 tarjetas de valores (ESPECIALISTAS, EXPERIENCIA, ASESORAMIENTO, HONESTIDAD) con íconos SVG inline.
- Se reusó el `useReveal.ts` existente para la aparición al scrollear (no se reescribió). Los contadores tienen su propio `IntersectionObserver` aparte (arrancan cuando el bloque de números entra en pantalla) y respetan `prefers-reduced-motion` (saltan directo al valor final, sin animar).
- Se extendió `placeholders.ts` con el contenido de esta sección (relato, stats, valores), tipado igual que las secciones anteriores.
- Se verificó levantando el sitio con Playwright (desktop 1440px y mobile 390px): la sección renderiza igual que el prototipo, los contadores animan y llegan al valor correcto, las tarjetas de valores aparecen con el stagger, el layout responsive cae a 2 y 1 columnas como corresponde, y no hay errores de consola.

**Archivos creados:** `components/QuienesSomos/QuienesSomos.tsx` + `.module.css`.
**Archivos modificados:** `data/placeholders.ts` (contenido de Quiénes somos), `App.tsx` (monta la sección).

**Decisiones propias / desvíos del brief:** ninguno relevante — mismo criterio visual (`--muted` local en vez del `--gray-text` global) que ya se usó en Hero/Servicios. Único ajuste técnico: el `setState` síncrono dentro del `useEffect` para el caso `prefers-reduced-motion` se movió a un `requestAnimationFrame` (mismo patrón que ya usa `Hero.tsx` para su animación de entrada) porque el lint del proyecto (`react-hooks/set-state-in-effect`) lo marcaba como error.

**Pendientes que quedaron abiertos:**
- El bloque de números (contadores) está sujeto a que Agus apruebe la idea; si no le convence, se replantea. Queda aislado en `quienesStats` (array en `placeholders.ts`), fácil de sacar o de reducir a 3 columnas si se elimina el volumen operado (dato sensible).
- Falta la foto real de oficina (la pasa Agus) — el componente ya deja el hueco listo para poner un `<img>` en su lugar.
- Relato, cifras de los contadores y contenido de valores son todos provisorios — los confirma Agus/Brio (igual que Servicios).


### 2026-09-12 — Sección Servicios
- Se portó el prototipo aprobado (`BrioServicios.jsx`) a un componente tipado: los 3 pilares de servicios (con "Financiamiento PyME" destacada), el listado de instrumentos por categoría, y la tabla de comisiones.
- La sección va debajo del Hero en la home, con ancla `#servicios` para cuando el menú del header apunte ahí.
- Se armó la animación de aparición al scrollear (fade + subida, escalonada tarjeta por tarjeta) como una pieza reusable aparte, para no reescribirla en cada sección nueva — se desactiva sola si el usuario tiene animaciones reducidas activadas.
- La tabla de comisiones en celular pasa a formato de tarjetas apiladas con etiquetas (Concepto / Comisión / Mínimo), en vez de una tabla angosta ilegible.
- Se extendió `placeholders.ts` (mismo archivo de la tarea anterior) con el contenido de esta sección, todo tipado y listo para Sanity.
- Se verificó levantando el sitio y mirando la sección en pantalla de escritorio y de celular, con el scroll disparando la animación — no tiró errores.

**Archivos creados:** `components/Servicios/Servicios.tsx` + `.module.css`, `hooks/useReveal.ts`.
**Archivos modificados:** `data/placeholders.ts` (contenido de Servicios), `App.tsx` (monta la sección).

**Decisiones propias / desvíos del brief:** ninguno relevante; se reusó el mismo criterio del gris de texto sobre fondo azul marino que ya se había documentado en la tarea del Hero.

**Pendientes que quedaron abiertos:**
- Frases de los 3 pilares, listado fino de instrumentos y valores de comisiones son todos provisorios — los tiene que confirmar Agus/Brio.
- El link "Panel de cotizaciones en vivo →" dentro de Renta variable todavía no conecta a nada (se resuelve cuando esté el panel de acciones real).


### 2026-09-11 — Navbar + Hero
- Se portó el prototipo aprobado (`BrioHero.jsx`, hecho a mano por Santiago con `<style>` inline) a componentes reales tipados con CSS propio, separados en Navbar y Hero.
- Se limpió el boilerplate de Vite (página de ejemplo, estilos y assets de la plantilla) que traía el proyecto recién scaffoldeado.
- Se armó `placeholders.ts` con todo el contenido de esta sección (copy del hero, links del menú, credenciales, mock de precios) para que más adelante se pueda enchufar a Sanity sin tocar los componentes.
- Se respetó el comportamiento del prototipo: la entrada progresiva de los bloques al cargar la página, el "latido" simulado del panel de acciones, que se desactiva si el usuario tiene animaciones reducidas en el sistema, y el menú que colapsa a hamburguesa en mobile.
- Se verificó levantando el sitio y mirándolo en pantalla de escritorio y de celular (con el menú abierto y cerrado) — no tiró errores.

**Archivos creados:** `styles/tokens.css`, `data/placeholders.ts`, `components/Navbar/Navbar.tsx` + `.module.css`, `components/Hero/Hero.tsx` + `.module.css`.
**Archivos modificados:** `App.tsx`, `main.tsx`, `index.css`, `index.html` (título de la pestaña).

**Decisiones propias / desvíos del brief:**
- En el prototipo, el header y el hero eran una sola pieza. Acá quedaron como dos bloques independientes (cada uno con su propio fondo azul marino), para que el header se pueda reusar después en otras páginas sin arrastrar todo el hero. Visualmente no cambia nada, es una decisión de organización interna.
- El gris de los textos secundarios del hero (bajada, nombre de las acciones) es más claro que el gris "oficial" de la paleta de marca, porque ese gris oficial fue pensado para fondos claros y sobre el azul marino casi no se lee. Se dejó documentado en el código para que quien reciba esto no lo confunda con un error.

**Pendientes que quedaron abiertos:**
- Falta el logo en vector real (hoy dice "brio valores" en texto).
- Falta el copy definitivo del hero (título y bajada están en placeholder, los define Agus).
- Los dropdowns de Servicios y Herramientas no abren todavía; la flechita es solo decorativa.
- El header no cambia de fondo al hacer scroll (sticky) — queda para otra tarea.
- El panel de acciones es un mock con números inventados; se conecta a la fuente de datos real más adelante.

## Pendientes globales
- Informes, Productos, Financiamiento PyME, Contacto, Equipo, Footer y las dos páginas legales ya tienen su página/sección real. Con Equipo, la home queda completa para esta etapa.
- **Resuelto:** fotos, nómina y bios reales de Equipo (ver entrada del 2026-10-05), salvo un pendiente puntual:
  - TODO(Agus): foto de Claudio Adrián Iglesias (hoy se ve con avatar de iniciales "CI"). Cuando llegue: WebP 960x1200 en `src/assets/equipo/claudio-iglesias.webp`, import + campo `foto` en `data/equipo.ts`.
- Noviembre 2026: se suma una décima persona al equipo (área Comercial). Es solo sumar un objeto al array `empleados` de `data/equipo.ts` (con su foto); la grilla se reacomoda sola.
- TODO(Agus): confirmar si las categorías "mensual" y "especial" de Informes aplican o hay que ajustarlas/sacarlas; solo el primer informe (semanal) es contenido real, los otros tres son de ejemplo.
- Configurar en Vercel `RESEND_API_KEY` y `CONTACTO_DESTINATARIO` (variables reales del envío de Contacto) y verificar un dominio propio de Brio en Resend para el remitente del mail.
- TODO(Agus): email, teléfono y dirección ya son reales (footer y home). Falta confirmar WhatsApp, horario de atención, y los links reales de Instagram y LinkedIn (hoy son placeholder en `footer.ts` y `contacto.ts`).
- TODO(Agus/asesoría legal): el texto de Términos y condiciones es un borrador genérico, falta el texto definitivo de la asesoría legal de Brio.
- Cotejar el Footer contra el prototipo `BrioFooter.jsx` si aparece más adelante (no estaba disponible en `__ref/` al hacer esa tarea, se armó directo desde la descripción del brief).
- Confirmar con Agus el contenido de Productos: si Renta variable suma opciones (CEDEARs y ADRs ya están confirmados y cargados), si Futuros y opciones va, y las líneas explicativas.
- Copy definitivo de todas las secciones (hoy todo es placeholder, salvo los valores de comisiones y las descripciones de los 3 pilares de Servicios, que ya son reales).
- Confirmar con Agus/Brio: listado fino de instrumentos de Servicios.
- Conexión real a Sanity (contenido editable desde el CMS) — `placeholders.ts`, `comisiones.ts`, `productos.ts`, `financiamiento.ts`, `contacto.ts` y `equipo.ts` ya están tipados para eso.
- **Resuelto:** "Panel de cotizaciones — Próximamente" del menú Herramientas: ya es link activo a la página real `/herramientas/acciones` (ver entrada del 2026-10-05).
- **Resuelto:** Servicios → Renta variable: "Panel de cotizaciones en vivo →" ya es link a `/herramientas/acciones` (ver entrada del 2026-10-07).
- **Resuelto:** conexión al backend de cotizaciones para reemplazar el mock de acciones del Hero (`/api/mercado/arg-stocks`, ver entrada del 2026-10-05).
- Agendar con Agus: candidato a Sanity para `ACCIONES_LIDERES` (`data/accionesLideres.ts`, los 8 tickers del panel del Hero y de /herramientas/acciones) — mismo criterio que `LECAPS_DATA`: hoy estático, solo lo edita el desarrollador; a futuro Agus podría elegir desde el CMS qué acciones mostrar y en qué orden.
- **Resuelto:** `/api/mercado/arg-stocks` probado contra data912 real en producción (ver entrada del 2026-10-07, fix de ERR_MODULE_NOT_FOUND).
- Producción: entrar directo a una ruta que no sea la home (recargar, link compartido) da 404 de Vercel. Falta la regla de reescritura para la SPA (`vercel.json`), sin pisar `/api/` (ver entrada del 2026-10-07).
- **Resuelto:** el Panel de Renta Fija (antes vivía aparte, en Netlify) ya está portado a `/herramientas/renta-fija`, con proxy propio y motor de cálculo verificado contra el original.
- Agendar con Agus: candidato a Sanity para `BONDS`/`SOVEREIGN_BONDS`/`LECAPS_DATA`/`BONCAPS_DATA` de Renta Fija (hoy estáticos, solo los edita el desarrollador).
- **Resuelto:** proxy de Renta Fija (`api/mercado/*`) probado contra data912 real en producción (ver entrada del 2026-10-07).
- **Resuelto:** panel lateral de flujo de fondos por ticker en Renta Fija (lo único de la herramienta vieja que había quedado afuera del port).
- **Resuelto:** la grilla del Calendario ya abre el panel de flujo de fondos al clickear un evento (y, en mobile, al tocar un ticker dentro de la hoja de detalle del día) — ver entrada del 2026-10-01 (grilla mensual).
- **Resuelto:** Renta Fija: las LECAPs/BONCAPs ya vencidas dejaron de aparecer en la tabla de Deuda Soberana (se filtran solas según la fecha de hoy, ver entrada del 2026-10-07). Igual conviene, cuando se actualicen los datos estáticos, sumar las licitaciones nuevas.
