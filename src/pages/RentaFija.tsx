import { useLayoutEffect, useRef, useState } from 'react';
import { useRentaFija, type FetchStatus } from '../hooks/useRentaFija';
import TablaONs from '../components/RentaFija/TablaONs';
import TablaSoberana from '../components/RentaFija/TablaSoberana';
import Calendario from '../components/RentaFija/Calendario';
import Cartera from '../components/RentaFija/Cartera';
import styles from '../components/RentaFija/RentaFija.module.css';

const TABS = [
  { id: 'ons', label: 'Obligaciones Negociables' },
  { id: 'sov', label: 'Deuda Soberana' },
  { id: 'cal', label: 'Calendario' },
  { id: 'car', label: 'Cartera' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const INTERVALOS = [
  { value: 0, label: 'Sin auto-refresh' },
  { value: 60, label: 'Cada 1 min' },
  { value: 120, label: 'Cada 2 min' },
  { value: 300, label: 'Cada 5 min' },
];

function StatusDot({ status }: { status: FetchStatus }) {
  const cls =
    status === 'ok' ? styles.dotOk : status === 'loading' ? styles.dotBusy : status === 'error' ? styles.dotErr : styles.dot;
  return <span className={cls} aria-hidden="true" />;
}

function fmtHora(d: Date | null): string {
  if (!d) return 'sin actualizar todavía';
  return `Actualizado ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}hs`;
}

/** Página /herramientas/renta-fija: diseño portado de `__ref/BrioRentaFija.jsx`
 * (prototipo aprobado), con el motor de cálculo y los datos reales portados de
 * `herramientaRentaFija.html` (ver `lib/rentaFija/` y `hooks/useRentaFija.ts`). */
export default function RentaFija() {
  const [tab, setTab] = useState<TabId>('ons');
  const [dir, setDir] = useState<1 | -1>(1);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ ons: null, sov: null, cal: null, car: null });
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const rf = useRentaFija();

  const changeTab = (id: TabId) => {
    if (id === tab) return;
    const order = TABS.map((t) => t.id);
    setDir(order.indexOf(id) > order.indexOf(tab) ? 1 : -1);
    setTab(id);
  };

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[tab];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tab]);

  return (
    <section className={styles.rentaFija} aria-labelledby="rf-title">
      <div className={styles.head}>
        <p className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Herramientas
        </p>
        <h1 id="rf-title" className={styles.title}>
          Panel de Renta Fija
        </h1>
        <p className={styles.lead}>
          Precios, TIR y duration de ONs, deuda soberana, LECAPs y BONCAPs — datos referenciales, actualizados automáticamente.
        </p>
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} role="tablist" aria-label="Secciones del panel">
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.isOn : ''}`}
              onClick={() => changeTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <span className={styles.tabIndicator} style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />
        </nav>

        {tab === 'ons' && (
          <div className={styles.status}>
            <StatusDot status={rf.onsStatus} />
            <span>{fmtHora(rf.onsLastUpdated)}</span>
            <select
              className={styles.intervalSelect}
              value={rf.onsIntervalSec}
              onChange={(e) => rf.setOnsIntervalSec(Number(e.target.value))}
              aria-label="Auto-refresh de Obligaciones Negociables"
            >
              {INTERVALOS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => rf.fetchOns()}>
              ⟳ Actualizar
            </button>
          </div>
        )}
        {tab === 'sov' && (
          <div className={styles.status}>
            <StatusDot status={rf.sovStatus} />
            <span>{fmtHora(rf.sovLastUpdated)}</span>
            <select
              className={styles.intervalSelect}
              value={rf.sovIntervalSec}
              onChange={(e) => rf.setSovIntervalSec(Number(e.target.value))}
              aria-label="Auto-refresh de Deuda Soberana y LECAPs"
            >
              {INTERVALOS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => rf.fetchSov()}>
              ⟳ Actualizar
            </button>
          </div>
        )}
      </div>

      <div className={styles.panelWrap}>
        <div key={tab} className={`${styles.panel} ${dir > 0 ? styles.enterRight : styles.enterLeft}`}>
          {tab === 'ons' && <TablaONs rows={rf.onsRows} onManualPriceChange={rf.setManualOnPrice} />}
          {tab === 'sov' && (
            <TablaSoberana
              sovRows={rf.sovRows}
              lecapRows={rf.lecapRows}
              onManualSovPriceChange={rf.setManualSovPrice}
              onManualLecapPriceChange={rf.setManualLecapPrice}
            />
          )}
          {tab === 'cal' && <Calendario events={rf.calEvents} />}
          {tab === 'car' && (
            <Cartera
              positions={rf.carPositions}
              universe={rf.carUniverse}
              flows={rf.carFlows}
              stats={rf.carStats}
              onAdd={rf.addCarPosition}
              onRemove={rf.removeCarPosition}
              onClear={rf.clearCarPositions}
            />
          )}
        </div>
      </div>

      <p className={styles.disclaimer}>
        Datos referenciales, no en tiempo real (actualización cada 2 minutos aprox.). No constituye recomendación de inversión.
      </p>
    </section>
  );
}
