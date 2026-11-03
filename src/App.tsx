import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavbarSanity from './components/Navbar/NavbarSanity';
import FooterSanity from './components/Footer/FooterSanity';
import Home from './pages/Home';
import { useScrollToTop } from './hooks/useScrollToTop';

/* Cada página que no es la home se baja aparte, recién cuando se entra a ella: así la home no
 * carga el código de Renta fija, del Panel de Cotizaciones ni de las legales (@portabletext/react). */
const ComisionesSanity = lazy(() => import('./pages/ComisionesSanity'));
const ProductosSanity = lazy(() => import('./pages/ProductosSanity'));
const FinanciamientoSanity = lazy(() => import('./pages/FinanciamientoSanity'));
const AbrirCuentaSanity = lazy(() => import('./pages/AbrirCuentaSanity'));
const InformesSanity = lazy(() => import('./pages/InformesSanity'));
const AccionesSanity = lazy(() => import('./pages/AccionesSanity'));
const RentaFija = lazy(() => import('./pages/RentaFija'));
const CodigoConductaSanity = lazy(() => import('./pages/CodigoConductaSanity'));
const TerminosSanity = lazy(() => import('./pages/TerminosSanity'));

function App() {
  useScrollToTop();

  return (
    <>
      {/* Navbar y Footer piden sus textos a Sanity cada uno por su cuenta (ver src/sanity/). */}
      <NavbarSanity />
      {/* Mientras baja el código de una página: una pantalla de fondo navy, para que el Footer no
          suba y después salte. Sin spinner ni texto (dura muy poco). */}
      <Suspense fallback={<div className="carga-pagina" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comisiones" element={<ComisionesSanity />} />
          <Route path="/servicios/financiamiento-pyme" element={<FinanciamientoSanity />} />
          <Route path="/servicios/productos" element={<ProductosSanity />} />
          <Route path="/abri-tu-cuenta" element={<AbrirCuentaSanity />} />
          <Route path="/informes" element={<InformesSanity />} />
          <Route path="/herramientas/acciones" element={<AccionesSanity />} />
          <Route path="/herramientas/renta-fija" element={<RentaFija />} />
          <Route path="/codigo-de-conducta" element={<CodigoConductaSanity />} />
          <Route path="/terminos-y-condiciones" element={<TerminosSanity />} />
        </Routes>
      </Suspense>
      <FooterSanity />
    </>
  );
}

export default App;
