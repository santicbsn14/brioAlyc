import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NavLinkItem } from '../../data/placeholders';
import logoBlanco from '../../assets/logo-brio-blanco.svg';
import styles from './Navbar.module.css';

export interface NavbarProps {
  logoAlt: string;
  links: NavLinkItem[];
  portfolioLabel: string;
  portfolioHref: string;
  ctaLabel: string;
  ctaHref: string;
}

const STICKY_THRESHOLD = 40;

export default function Navbar({
  logoAlt,
  links,
  portfolioLabel,
  portfolioHref,
  ctaLabel,
  ctaHref,
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Entrada orquestada (fade + subida), una sola vez al montar.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sticky: cambia de fondo pasado el umbral de scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > STICKY_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el dropdown abierto al clickear afuera o con Escape.
  useEffect(() => {
    if (!openDropdown) return;

    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openDropdown]);

  const closeAll = () => {
    setNavOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  const renderDropdown = (link: NavLinkItem) => {
    const isOpen = openDropdown === link.label;
    return (
      <div key={link.label} className={styles.navItem}>
        <button
          type="button"
          className={`${styles.navTrigger} ${styles.hasSub}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => toggleDropdown(link.label)}
        >
          {link.label}
          <span className={styles.caret} aria-hidden="true">
            ▾
          </span>
        </button>
        <div className={`${styles.dropdownPanel} ${isOpen ? styles.isOpen : ''}`}>
          {link.dropdownItems?.map((item) => {
            if (item.kind === 'disabled') {
              return (
                <span key={item.label} className={styles.dropdownItemDisabled} aria-disabled="true">
                  {item.label}
                  <em className={styles.soonTag}>Próximamente</em>
                </span>
              );
            }
            if (item.kind === 'external') {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.dropdownItem}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAll}
                >
                  {item.label}
                  <span className={styles.externalIcon} aria-hidden="true">
                    ↗
                  </span>
                </a>
              );
            }
            return (
              <Link key={item.label} to={item.href ?? '/'} className={styles.dropdownItem} onClick={closeAll}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <header ref={navRef} className={`${styles.nav} ${mounted ? styles.isIn : ''} ${scrolled ? styles.isScrolled : ''}`}>
      <Link to="/" className={styles.brand} aria-label="Brio Valores — inicio" onClick={closeAll}>
        <img src={logoBlanco} alt={logoAlt} className={styles.logo} />
      </Link>

      <nav className={`${styles.navlinks} ${navOpen ? styles.isOpen : ''}`} aria-label="Principal">
        {links.map((link) =>
          link.dropdownItems ? (
            renderDropdown(link)
          ) : (
            <Link key={link.label} to={link.href ?? '/'} onClick={closeAll}>
              {link.label}
            </Link>
          ),
        )}

        {/* acciones dentro del panel, solo en mobile */}
        <div className={styles.mobileActions}>
          <a
            href={portfolioHref}
            className={styles.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeAll}
          >
            {portfolioLabel}
            <span className={styles.externalIcon} aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            href={ctaHref}
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
            onClick={closeAll}
          >
            {ctaLabel}
          </a>
        </div>
      </nav>

      <div className={styles.actions}>
        <a href={portfolioHref} className={styles.portfolio} target="_blank" rel="noopener noreferrer">
          {portfolioLabel}
          <span className={styles.externalIcon} aria-hidden="true">
            ↗
          </span>
        </a>
        <a href={ctaHref} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
          {ctaLabel}
        </a>
      </div>

      <button
        className={`${styles.burger} ${navOpen ? styles.isOpen : ''}`}
        aria-label="Abrir menú"
        aria-expanded={navOpen}
        onClick={() => setNavOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
