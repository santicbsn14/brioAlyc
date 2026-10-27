import { Route, Routes } from 'react-router-dom';
import NavbarSanity from './components/Navbar/NavbarSanity';
import FooterSanity from './components/Footer/FooterSanity';
import Home from './pages/Home';
import ComisionesSanity from './pages/ComisionesSanity';
import ProductosSanity from './pages/ProductosSanity';
import FinanciamientoSanity from './pages/FinanciamientoSanity';
import AbrirCuentaSanity from './pages/AbrirCuentaSanity';
import InformesSanity from './pages/InformesSanity';
import RentaFija from './pages/RentaFija';
import Acciones from './pages/Acciones';
import CodigoConductaSanity from './pages/CodigoConductaSanity';
import TerminosSanity from './pages/TerminosSanity';
import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  useScrollToTop();

  return (
    <>
      {/* Navbar y Footer piden sus textos a Sanity cada uno por su cuenta (ver src/sanity/). */}
      <NavbarSanity />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comisiones" element={<ComisionesSanity />} />
        <Route path="/servicios/financiamiento-pyme" element={<FinanciamientoSanity />} />
        <Route path="/servicios/productos" element={<ProductosSanity />} />
        <Route path="/abri-tu-cuenta" element={<AbrirCuentaSanity />} />
        <Route path="/informes" element={<InformesSanity />} />
        <Route path="/herramientas/acciones" element={<Acciones />} />
        <Route path="/herramientas/renta-fija" element={<RentaFija />} />
        <Route path="/codigo-de-conducta" element={<CodigoConductaSanity />} />
        <Route path="/terminos-y-condiciones" element={<TerminosSanity />} />
      </Routes>
      <FooterSanity />
    </>
  );
}

export default App;
