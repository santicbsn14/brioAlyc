import { Route, Routes } from 'react-router-dom';
import NavbarSanity from './components/Navbar/NavbarSanity';
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
