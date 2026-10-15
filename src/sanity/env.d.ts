// Variables de entorno de Sanity (ver .env.example). Todas opcionales.
interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
  readonly VITE_SANITY_USE_CDN?: string;
  readonly VITE_MOSTRAR_FALTANTES?: string;
}
