import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './index.css'
import App from './App.tsx'
import { enVistaPrevia } from './sanity/edicion'

/** Adentro de la "Vista previa" del Studio, primero se baja el código de edición visual (datos en
 * vivo, marcas y overlays: sanity/vistaPrevia/) y recién después se pinta la app, así todas las
 * queries ya salen con él. La web pública no lo baja nunca. Si falla la descarga, la página se
 * pinta igual, como la pública. */
async function cargarVistaPrevia(): Promise<ComponentType | null> {
  if (!enVistaPrevia()) return null
  try {
    return (await import('./sanity/vistaPrevia')).default
  } catch (error) {
    console.warn('[vista previa] No se pudo cargar la edición visual:', error)
    return null
  }
}

cargarVistaPrevia().then((VistaPrevia) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
        {VistaPrevia && <VistaPrevia />}
      </BrowserRouter>
    </StrictMode>,
  )
})
