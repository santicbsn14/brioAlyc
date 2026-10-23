import { Route, Routes } from 'react-router-dom';
import NavbarSanity from './components/Navbar/NavbarSanity';
import FooterSanity from './components/Footer/FooterSanity';
import Home from './pages/Home';
import Comisiones from './pages/Comisiones';
import ProductosSanity from './pages/ProductosSanity';
import FinanciamientoSanity from './pages/FinanciamientoSanity';
import InformesSanity from './pages/InformesSanity';
import RentaFija from './pages/RentaFija';
import Acciones from './pages/Acciones';
import CodigoConducta from './pages/CodigoConducta';
import TerminosCondiciones from './pages/TerminosCondiciones';
import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  useScrollToTop();

  return (
    <>
      {/* Navbar y Footer piden sus textos a Sanity cada uno por su cuenta (ver src/sanity/). */}
      <NavbarSanity />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comisiones" element={<Comisiones />} />
        <Route path="/servicios/financiamiento-pyme" element={<FinanciamientoSanity />} />
        <Route path="/servicios/productos" element={<ProductosSanity />} />
        <Route path="/informes" element={<InformesSanity />} />
        <Route path="/herramientas/acciones" element={<Acciones />} />
        <Route path="/herramientas/renta-fija" element={<RentaFija />} />
        <Route path="/codigo-de-conducta" element={<CodigoConducta />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
      </Routes>
      <FooterSanity />
    </>
  );
}

export default App;
