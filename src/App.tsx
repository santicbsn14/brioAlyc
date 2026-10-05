import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Comisiones from './pages/Comisiones';
import Productos from './pages/Productos';
import FinanciamientoPyme from './pages/FinanciamientoPyme';
import Informes from './pages/Informes';
import RentaFija from './pages/RentaFija';
import Acciones from './pages/Acciones';
import CodigoConducta from './pages/CodigoConducta';
import TerminosCondiciones from './pages/TerminosCondiciones';
import { brand, navLinks, navActions } from './data/placeholders';
import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  useScrollToTop();

  return (
    <>
      <Navbar
        logoAlt={brand.logoAlt}
        links={navLinks}
        portfolioLabel={navActions.portfolioLabel}
        portfolioHref={navActions.portfolioHref}
        ctaLabel={navActions.ctaLabel}
        ctaHref={navActions.ctaHref}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comisiones" element={<Comisiones />} />
        <Route path="/servicios/financiamiento-pyme" element={<FinanciamientoPyme />} />
        <Route path="/servicios/productos" element={<Productos />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/herramientas/acciones" element={<Acciones />} />
        <Route path="/herramientas/renta-fija" element={<RentaFija />} />
        <Route path="/codigo-de-conducta" element={<CodigoConducta />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
