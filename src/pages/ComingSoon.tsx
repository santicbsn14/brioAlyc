export interface ComingSoonProps {
  title: string;
}

/** Placeholder mínimo para rutas cuya página todavía no se construyó. */
export default function ComingSoon({ title }: ComingSoonProps) {
  return <div>{title} — Próximamente</div>;
}
