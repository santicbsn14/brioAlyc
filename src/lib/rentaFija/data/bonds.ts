// ═══════════════════════════════════════════════════════════════════
// DATOS ESTÁTICOS — Obligaciones Negociables (BONDS) y Deuda Soberana
// (SOVEREIGN_BONDS), con sus cashflows completos.
//
// Portados TAL CUAL desde la herramienta vieja de Brio (herramientaRentaFija.html,
// arrays BONDS y SOVEREIGN_BONDS) — mismos emisores, tickers, leyes, vencimientos
// y flujos de fondos. No se resumió ni se inventó ningún cashflow.
//
// Hoy son estáticos y solo los puede editar el desarrollador (hay que tocar este
// archivo y hacer un deploy para dar de alta una ON nueva o corregir un flujo).
// Candidato a Fase 2: modelarlos en Sanity (un documento por título, con sus
// cashflows como array embebido) para que Brio pueda cargar/actualizar esto sin
// pedir un deploy. No se implementa Sanity ahora, solo queda la nota.
// ═══════════════════════════════════════════════════════════════════

export interface Cashflow {
  fecha: string;
  cf: number;
  amort: number;
}

export interface Bond {
  emisor: string;
  titulo: string;
  ticker: string;
  ley: string;
  vencimiento: string;
  /** Casi siempre number; un par de entradas del original la tienen como string
   * (ej. "1000") — se preserva tal cual, no se normalizó el dato de origen. */
  lamina: number | string;
  cashflows: Cashflow[];
}

export interface SovereignBond {
  grupo: string;
  ticker: string;
  titulo: string;
  ley: string;
  vencimiento: string;
  cashflows: Cashflow[];
  /** Un par de entradas del original traen estos dos campos de más (residuo de
   * copiar/pegar desde BONDS) — no se usan en ningún cálculo, se preservan igual
   * porque el dato se porta tal cual, sin "limpiarlo". */
  emisor?: string;
  lamina?: number | string;
}

export const BONDS: Bond[] = [
  {
    "emisor": "LOMA",
    "titulo": "LOC5D - Loma Negra 2027 U$S 8.00%",
    "ticker": "LOC5O",
    "ley": "Local",
    "vencimiento": "26/07/2027",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-07-24",
        "cf": 3.956,
        "amort": 0
      },
      {
        "fecha": "2027-01-24",
        "cf": 4.022,
        "amort": 0
      },
      {
        "fecha": "2027-07-24",
        "cf": 104.022,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "LOMA",
    "titulo": "LOC6D Loma Negra 2029 u$s 6,50%",
    "ticker": "LOC6O",
    "ley": "Local",
    "vencimiento": "23/01/2029",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-07-23",
        "cf": 3.22,
        "amort": 0
      },
      {
        "fecha": "2027-01-23",
        "cf": 3.28,
        "amort": 0
      },
      {
        "fecha": "2027-07-23",
        "cf": 3.22,
        "amort": 0
      },
      {
        "fecha": "2028-01-23",
        "cf": 3.28,
        "amort": 0
      },
      {
        "fecha": "2028-07-23",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2029-01-23",
        "cf": 103.28,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS51D - Cresud 2027 U$S 5,75%",
    "ticker": "CS51O",
    "ley": "Local",
    "vencimiento": "20/01/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-20",
        "cf": 2.85,
        "amort": 0
      },
      {
        "fecha": "2027-01-20",
        "cf": 102.9,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS52D - Cresud 2028 U$S 4.75%",
    "ticker": "CS52O",
    "ley": "Local",
    "vencimiento": "30/04/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2027-01-30",
        "cf": 3.58,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 1.17,
        "amort": 0
      },
      {
        "fecha": "2027-10-30",
        "cf": 2.38,
        "amort": 0
      },
      {
        "fecha": "2028-04-30",
        "cf": 102.38,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS48D - Cresud 2028 u$s 8,00%",
    "ticker": "CS48O",
    "ley": "Local",
    "vencimiento": "11/07/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-11",
        "cf": 3.97,
        "amort": 0
      },
      {
        "fecha": "2027-01-11",
        "cf": 4.03,
        "amort": 0
      },
      {
        "fecha": "2027-07-11",
        "cf": 3.97,
        "amort": 0
      },
      {
        "fecha": "2028-01-11",
        "cf": 4.03,
        "amort": 0
      },
      {
        "fecha": "2028-07-11",
        "cf": 103.99,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS47D - Cresud 2028 u$s 7.00%",
    "ticker": "CS47O",
    "ley": "Local",
    "vencimiento": "15/11/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-05-15",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2026-11-15",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2027-05-15",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2027-11-15",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2028-05-15",
        "cf": 3.49,
        "amort": 0
      },
      {
        "fecha": "2028-11-15",
        "cf": 103.53,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS50D - Cresud 2029 u$s 7,25%",
    "ticker": "CS50O",
    "ley": "Local",
    "vencimiento": "10/03/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-09-10",
        "cf": 5.44,
        "amort": 0
      },
      {
        "fecha": "2027-03-10",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2027-09-10",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2028-03-10",
        "cf": 3.62,
        "amort": 0
      },
      {
        "fecha": "2028-09-11",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2029-03-12",
        "cf": 103.6,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "CRESUD",
    "titulo": "CS53D - Cresud 2030 u$s 6,25%",
    "ticker": "CS53O",
    "ley": "Local",
    "vencimiento": "30/04/2030",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2027-01-30",
        "cf": 4.71,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 1.54,
        "amort": 0
      },
      {
        "fecha": "2027-10-30",
        "cf": 3.13,
        "amort": 0
      },
      {
        "fecha": "2028-04-30",
        "cf": 3.13,
        "amort": 0
      },
      {
        "fecha": "2028-10-30",
        "cf": 3.13,
        "amort": 0
      },
      {
        "fecha": "2029-04-30",
        "cf": 3.12,
        "amort": 0
      },
      {
        "fecha": "2029-10-30",
        "cf": 3.13,
        "amort": 0
      },
      {
        "fecha": "2030-04-30",
        "cf": 103.12,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCQD - Pampa Energia 2028 u$s 7,25%",
    "ticker": "MGCQO",
    "ley": "Local",
    "vencimiento": "07/08/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-06",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2027-02-06",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2027-08-06",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2028-02-06",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2028-08-06",
        "cf": 103.62,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCND - Pampa Energia 2028 u$s 5,75%",
    "ticker": "MGCNO",
    "ley": "Local",
    "vencimiento": "04/10/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-10-04",
        "cf": 2.88,
        "amort": 0
      },
      {
        "fecha": "2027-04-04",
        "cf": 2.87,
        "amort": 0
      },
      {
        "fecha": "2027-10-04",
        "cf": 2.88,
        "amort": 0
      },
      {
        "fecha": "2028-04-04",
        "cf": 2.88,
        "amort": 0
      },
      {
        "fecha": "2028-10-04",
        "cf": 102.88,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCTO - Pampa Energia 2029 u$s",
    "ticker": "MGCTO",
    "ley": "Local",
    "vencimiento": "02/04/2029",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-10-01",
        "cf": 2.75,
        "amort": 0
      },
      {
        "fecha": "2027-04-01",
        "cf": 2.74,
        "amort": 0
      },
      {
        "fecha": "2027-10-01",
        "cf": 2.75,
        "amort": 0
      },
      {
        "fecha": "2028-04-01",
        "cf": 2.75,
        "amort": 0
      },
      {
        "fecha": "2028-10-01",
        "cf": 2.75,
        "amort": 0
      },
      {
        "fecha": "2029-04-01",
        "cf": 102.74,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCUO - Pampa Energía 2030 u$s 5,50%",
    "ticker": "MGCUO",
    "ley": "Local",
    "vencimiento": "21/08/2030",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-08-21",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2027-02-21",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2027-08-21",
        "cf": 2.73,
        "amort": 0
      },
      {
        "fecha": "2028-02-21",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2028-08-21",
        "cf": 2.74,
        "amort": 0
      },
      {
        "fecha": "2029-02-21",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2029-08-21",
        "cf": 2.73,
        "amort": 0
      },
      {
        "fecha": "2030-02-21",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2030-08-21",
        "cf": 102.73,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCMO - Pampa Energia 2031 u$s",
    "ticker": "MGCMO",
    "ley": "NY",
    "vencimiento": "10/09/2031",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2024-09-10",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2025-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2025-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2026-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2026-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2027-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2027-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2028-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2028-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2029-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2029-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2030-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2030-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2031-03-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2031-09-10",
        "cf": 103.98,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCOD - Pampa Energia 2034 u$s 7,875%",
    "ticker": "MGCOO",
    "ley": "NY",
    "vencimiento": "16/12/2034",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2026-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-12-18",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-06-19",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-12-17",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-06-18",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2031-06-17",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2031-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2032-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2032-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2033-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2033-12-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2034-06-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2034-12-18",
        "cf": 103.94,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pampa Energía",
    "titulo": "MGCRD - Pampa Energia 2037 u$s 7,75%",
    "ticker": "MGCRO",
    "ley": "NY",
    "vencimiento": "14/11/2037",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2026-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2032-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2032-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2033-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2033-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2034-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2034-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2035-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2035-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2036-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2036-11-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2037-05-14",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2037-11-14",
        "cf": 103.88,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "EDENOR",
    "titulo": "DNC3D - Edenor 2026 u$s 9,75%",
    "ticker": "DNC3O",
    "ley": "Local",
    "vencimiento": "22/11/2026",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-05-22",
        "cf": 4.83,
        "amort": 0
      },
      {
        "fecha": "2026-11-22",
        "cf": 104.92,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "EDENOR",
    "titulo": "DNC5D - Edenor 2028 u$s 9,50%",
    "ticker": "DNC5O",
    "ley": "Local",
    "vencimiento": "05/08/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-05",
        "cf": 4.71,
        "amort": 0
      },
      {
        "fecha": "2027-02-05",
        "cf": 4.79,
        "amort": 0
      },
      {
        "fecha": "2027-08-05",
        "cf": 4.71,
        "amort": 0
      },
      {
        "fecha": "2028-02-07",
        "cf": 4.79,
        "amort": 0
      },
      {
        "fecha": "2028-08-05",
        "cf": 104.74,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "EDENOR",
    "titulo": "DNC7D - Edenor 2030 u$s 9,75%",
    "ticker": "DNC7O",
    "ley": "NY",
    "vencimiento": "24/10/2030",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-04-24",
        "cf": 4.86,
        "amort": 0
      },
      {
        "fecha": "2026-10-24",
        "cf": 4.89,
        "amort": 0
      },
      {
        "fecha": "2027-04-24",
        "cf": 4.86,
        "amort": 0
      },
      {
        "fecha": "2027-10-24",
        "cf": 4.89,
        "amort": 0
      },
      {
        "fecha": "2028-04-24",
        "cf": 4.89,
        "amort": 0
      },
      {
        "fecha": "2028-10-24",
        "cf": 38.22,
        "amort": 33.33
      },
      {
        "fecha": "2029-04-24",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2029-10-24",
        "cf": 36.59,
        "amort": 33.33
      },
      {
        "fecha": "2030-04-24",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2030-10-24",
        "cf": 34.97,
        "amort": 33.34
      }
    ]
  },
  {
    "emisor": "EDENOR",
    "titulo": "DNCAO Edenor Clase 10 Serie II u$s",
    "ticker": "DNCAO",
    "ley": "NY",
    "vencimiento": "28/04/2033",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-10-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2027-04-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2027-10-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2028-04-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2028-10-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2029-04-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2029-10-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2030-04-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2030-10-28",
        "cf": 4.75,
        "amort": 0
      },
      {
        "fecha": "2031-04-28",
        "cf": 38.08,
        "amort": 33.33
      },
      {
        "fecha": "2031-10-28",
        "cf": 3.17,
        "amort": 0
      },
      {
        "fecha": "2032-04-28",
        "cf": 36.5,
        "amort": 33.33
      },
      {
        "fecha": "2032-10-28",
        "cf": 1.58,
        "amort": 0
      },
      {
        "fecha": "2033-04-28",
        "cf": 34.92,
        "amort": 33.34
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YFCND - YPF 2026 USD 6%",
    "ticker": "YFCNO",
    "ley": "Local",
    "vencimiento": "03/10/2026",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-10-03",
        "cf": 103,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM41D - YPF 2027 u$s 6%",
    "ticker": "YM41O",
    "ley": "Local",
    "vencimiento": "08/01/2027",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-07-08",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-08",
        "cf": 1.51,
        "amort": 0
      },
      {
        "fecha": "2027-01-08",
        "cf": 101.51,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM37D - YPF 2027 U$S 7%",
    "ticker": "YM37O",
    "ley": "Local",
    "vencimiento": "07/05/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-05-07",
        "cf": 1.71,
        "amort": 0
      },
      {
        "fecha": "2026-08-07",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2026-11-07",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2027-02-07",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2027-05-07",
        "cf": 101.71,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YCAMO YPF 2027 u$s 6,95%",
    "ticker": "YCAMO",
    "ley": "Local",
    "vencimiento": "21/07/2027",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-07-21",
        "cf": 3.48,
        "amort": 0
      },
      {
        "fecha": "2027-01-21",
        "cf": 3.48,
        "amort": 0
      },
      {
        "fecha": "2027-07-21",
        "cf": 103.48,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM38D - YPF 2027 U$S 7,5%",
    "ticker": "YM38O",
    "ley": "Local",
    "vencimiento": "22/07/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-04-22",
        "cf": 1.85,
        "amort": 0
      },
      {
        "fecha": "2026-07-22",
        "cf": 1.87,
        "amort": 0
      },
      {
        "fecha": "2026-10-22",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-01-22",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-04-22",
        "cf": 1.85,
        "amort": 0
      },
      {
        "fecha": "2027-07-22",
        "cf": 101.87,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM40D - YPF 2028 u$s 7.5%",
    "ticker": "YM40O",
    "ley": "Local",
    "vencimiento": "28/08/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-05-28",
        "cf": 1.83,
        "amort": 0
      },
      {
        "fecha": "2026-08-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2026-11-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-02-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-05-28",
        "cf": 1.83,
        "amort": 0
      },
      {
        "fecha": "2027-08-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-11-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2028-02-28",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2028-05-28",
        "cf": 1.85,
        "amort": 0
      },
      {
        "fecha": "2028-08-28",
        "cf": 101.89,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMCZD - YPF 2028 u$s 7%",
    "ticker": "YMCZO",
    "ley": "Local",
    "vencimiento": "10/10/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-10-10",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2027-04-10",
        "cf": 3.49,
        "amort": 0
      },
      {
        "fecha": "2027-10-10",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2028-04-10",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2028-10-10",
        "cf": 103.51,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMCYD - YPF 2028 6,50%",
    "ticker": "YMCYO",
    "ley": "Local",
    "vencimiento": "10/10/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-07-10",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2026-10-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-01-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-04-10",
        "cf": 1.6,
        "amort": 0
      },
      {
        "fecha": "2027-07-10",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2027-10-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2028-01-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2028-04-10",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2028-07-10",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2028-10-10",
        "cf": 101.64,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM42D - YPF 2029 US$ 7%",
    "ticker": "YM42O",
    "ley": "Local",
    "vencimiento": "02/03/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-06-02",
        "cf": 3.49,
        "amort": 0
      },
      {
        "fecha": "2026-12-02",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2027-06-02",
        "cf": 3.49,
        "amort": 0
      },
      {
        "fecha": "2027-12-02",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2028-06-02",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2028-12-04",
        "cf": 3.51,
        "amort": 0
      },
      {
        "fecha": "2029-03-02",
        "cf": 101.73,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMC1D - YPF 2029 U$S 8,50%",
    "ticker": "YMC1O",
    "ley": "Local",
    "vencimiento": "27/06/2029",
    "lamina": "1000",
    "cashflows": [
      {
        "fecha": "2026-06-27",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2026-12-27",
        "cf": 4.23,
        "amort": 0
      },
      {
        "fecha": "2027-06-27",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-12-27",
        "cf": 4.23,
        "amort": 0
      },
      {
        "fecha": "2028-06-27",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-12-27",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-06-27",
        "cf": 104.25,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMCID - YPF 2029 u$s Step-up",
    "ticker": "YMCIO",
    "ley": "NY",
    "vencimiento": "30/06/2029",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-06-30",
        "cf": 18.78,
        "amort": 14.28
      },
      {
        "fecha": "2026-12-30",
        "cf": 18.14,
        "amort": 14.28
      },
      {
        "fecha": "2027-06-30",
        "cf": 17.49,
        "amort": 14.28
      },
      {
        "fecha": "2027-12-30",
        "cf": 16.85,
        "amort": 14.28
      },
      {
        "fecha": "2028-06-30",
        "cf": 16.21,
        "amort": 14.28
      },
      {
        "fecha": "2029-01-02",
        "cf": 15.57,
        "amort": 14.28
      },
      {
        "fecha": "2029-07-02",
        "cf": 14.97,
        "amort": 14.32
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM43O YPF Clase XLIII u$s",
    "ticker": "YM43O",
    "ley": "Local",
    "vencimiento": "14/04/2030",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2027-01-14",
        "cf": 4.14,
        "amort": 0
      },
      {
        "fecha": "2027-07-14",
        "cf": 2.73,
        "amort": 0
      },
      {
        "fecha": "2028-01-14",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2028-07-14",
        "cf": 2.74,
        "amort": 0
      },
      {
        "fecha": "2029-01-14",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2029-07-14",
        "cf": 2.73,
        "amort": 0
      },
      {
        "fecha": "2030-01-14",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2030-04-14",
        "cf": 101.36,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM39D - YPF 2030 u$s 8,75%",
    "ticker": "YM39O",
    "ley": "NY",
    "vencimiento": "22/07/2030",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-22",
        "cf": 4.4,
        "amort": 0
      },
      {
        "fecha": "2027-01-22",
        "cf": 4.47,
        "amort": 0
      },
      {
        "fecha": "2027-07-22",
        "cf": 4.4,
        "amort": 0
      },
      {
        "fecha": "2028-01-24",
        "cf": 4.47,
        "amort": 0
      },
      {
        "fecha": "2028-07-24",
        "cf": 4.42,
        "amort": 0
      },
      {
        "fecha": "2029-01-22",
        "cf": 4.47,
        "amort": 0
      },
      {
        "fecha": "2029-07-23",
        "cf": 4.4,
        "amort": 0
      },
      {
        "fecha": "2030-01-22",
        "cf": 4.47,
        "amort": 0
      },
      {
        "fecha": "2030-07-22",
        "cf": 104.4,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMCXD - YPF 2031 u$s 8,75%",
    "ticker": "YMCXO",
    "ley": "NY",
    "vencimiento": "11/09/2031",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-11",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2027-03-11",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2027-09-13",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2028-03-13",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2028-09-11",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2029-03-12",
        "cf": 4.38,
        "amort": 0
      },
      {
        "fecha": "2029-09-11",
        "cf": 24.38,
        "amort": 20
      },
      {
        "fecha": "2030-03-11",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2030-09-11",
        "cf": 23.5,
        "amort": 20
      },
      {
        "fecha": "2031-03-11",
        "cf": 2.63,
        "amort": 0
      },
      {
        "fecha": "2031-09-11",
        "cf": 62.63,
        "amort": 60
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YFCJO YPF Clase XVIII u$s",
    "ticker": "YFCJO",
    "ley": "NY",
    "vencimiento": "16/10/2032",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-10-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-04-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-10-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-04-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-10-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-04-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-10-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-04-16",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-10-16",
        "cf": 36.94,
        "amort": 33
      },
      {
        "fecha": "2031-04-16",
        "cf": 2.64,
        "amort": 0
      },
      {
        "fecha": "2031-10-16",
        "cf": 35.64,
        "amort": 33
      },
      {
        "fecha": "2032-04-16",
        "cf": 1.34,
        "amort": 0
      },
      {
        "fecha": "2032-10-16",
        "cf": 35.34,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YMCJD - YPF 2033 u$s Step-up",
    "ticker": "YMCJO",
    "ley": "NY",
    "vencimiento": "30/09/2033",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-30",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2027-03-30",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2027-09-30",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2028-03-30",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2028-10-02",
        "cf": 3.54,
        "amort": 0
      },
      {
        "fecha": "2029-04-03",
        "cf": 3.52,
        "amort": 0
      },
      {
        "fecha": "2029-10-01",
        "cf": 3.46,
        "amort": 0
      },
      {
        "fecha": "2030-04-01",
        "cf": 3.5,
        "amort": 0
      },
      {
        "fecha": "2030-09-30",
        "cf": 28.5,
        "amort": 25
      },
      {
        "fecha": "2031-03-31",
        "cf": 2.63,
        "amort": 0
      },
      {
        "fecha": "2031-09-30",
        "cf": 27.63,
        "amort": 25
      },
      {
        "fecha": "2032-03-30",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2032-09-30",
        "cf": 26.75,
        "amort": 25
      },
      {
        "fecha": "2033-03-30",
        "cf": 0.88,
        "amort": 0
      },
      {
        "fecha": "2033-09-30",
        "cf": 25.88,
        "amort": 25
      }
    ]
  },
  {
    "emisor": "YPF SA",
    "titulo": "YM34D - YPF 2034 U$S 8,25%",
    "ticker": "YM34O",
    "ley": "NY",
    "vencimiento": "17/01/2034",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2027-01-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2027-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2028-01-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2028-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2029-01-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2029-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2030-01-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2030-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2031-01-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2031-07-17",
        "cf": 4.13,
        "amort": 0
      },
      {
        "fecha": "2032-01-17",
        "cf": 34.13,
        "amort": 30
      },
      {
        "fecha": "2032-07-17",
        "cf": 2.89,
        "amort": 0
      },
      {
        "fecha": "2033-01-17",
        "cf": 32.89,
        "amort": 30
      },
      {
        "fecha": "2033-07-17",
        "cf": 1.65,
        "amort": 0
      },
      {
        "fecha": "2034-01-17",
        "cf": 41.65,
        "amort": 40
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCPD - Vista Energy 2029 u$s 8%",
    "ticker": "VSCPO",
    "ley": "Local",
    "vencimiento": "03/05/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-05-04",
        "cf": 3.97,
        "amort": 0
      },
      {
        "fecha": "2026-11-03",
        "cf": 4.03,
        "amort": 0
      },
      {
        "fecha": "2027-05-03",
        "cf": 3.97,
        "amort": 0
      },
      {
        "fecha": "2027-11-03",
        "cf": 29.03,
        "amort": 25
      },
      {
        "fecha": "2028-05-03",
        "cf": 27.99,
        "amort": 25
      },
      {
        "fecha": "2028-11-03",
        "cf": 27.02,
        "amort": 25
      },
      {
        "fecha": "2029-05-03",
        "cf": 25.99,
        "amort": 25
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCZO - Vista Energy 2029 u$s",
    "ticker": "VSCZO",
    "ley": "Local",
    "vencimiento": "16/07/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2027-01-16",
        "cf": 2.52,
        "amort": 0
      },
      {
        "fecha": "2027-07-16",
        "cf": 2.48,
        "amort": 0
      },
      {
        "fecha": "2028-01-16",
        "cf": 2.52,
        "amort": 0
      },
      {
        "fecha": "2028-07-16",
        "cf": 2.49,
        "amort": 0
      },
      {
        "fecha": "2029-01-16",
        "cf": 2.52,
        "amort": 0
      },
      {
        "fecha": "2029-07-16",
        "cf": 102.48,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCUD - Vista Energy 2030 u$s 7,50%",
    "ticker": "VSCUO",
    "ley": "Local",
    "vencimiento": "07/03/2030",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-09-07",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-03-07",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2027-09-07",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2028-03-07",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2028-09-07",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2029-03-07",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2029-09-07",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2030-03-07",
        "cf": 103.72,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCRD - Vista Energy 2031 u$s 7,65%",
    "ticker": "VSCRO",
    "ley": "Local",
    "vencimiento": "10/10/2031",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-10-10",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2027-04-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-10-10",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2028-04-10",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2028-10-10",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2029-04-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-10-10",
        "cf": 36.84,
        "amort": 33
      },
      {
        "fecha": "2030-04-10",
        "cf": 2.56,
        "amort": 0
      },
      {
        "fecha": "2030-10-10",
        "cf": 35.57,
        "amort": 33
      },
      {
        "fecha": "2031-04-10",
        "cf": 1.3,
        "amort": 0
      },
      {
        "fecha": "2031-10-10",
        "cf": 35.3,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCVD - Vista Energy 2033 u$s 8,5%",
    "ticker": "VSCVO",
    "ley": "NY",
    "vencimiento": "10/06/2033",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-06-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2026-12-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-06-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-12-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-06-12",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-12-11",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-06-11",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-12-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-06-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-12-10",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2031-06-10",
        "cf": 37.25,
        "amort": 33
      },
      {
        "fecha": "2031-12-10",
        "cf": 2.85,
        "amort": 0
      },
      {
        "fecha": "2032-06-10",
        "cf": 35.85,
        "amort": 33
      },
      {
        "fecha": "2032-12-10",
        "cf": 1.45,
        "amort": 0
      },
      {
        "fecha": "2033-06-10",
        "cf": 35.45,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCTD - Vista Energy 2035 u$s 7,625%",
    "ticker": "VSCTO",
    "ley": "NY",
    "vencimiento": "10/12/2035",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2026-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-06-12",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-12-11",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-06-11",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2031-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2031-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2032-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2032-12-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2033-06-10",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2033-12-12",
        "cf": 36.81,
        "amort": 33
      },
      {
        "fecha": "2034-06-12",
        "cf": 2.55,
        "amort": 0
      },
      {
        "fecha": "2034-12-11",
        "cf": 35.55,
        "amort": 33
      },
      {
        "fecha": "2035-06-11",
        "cf": 1.3,
        "amort": 0
      },
      {
        "fecha": "2035-12-10",
        "cf": 35.3,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "VISTA ENERGY",
    "titulo": "VSCXD - Vista Energy 2038 u$s 7,875%",
    "ticker": "VSCXO",
    "ley": "NY",
    "vencimiento": "08/04/2038",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-04-08",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2026-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2029-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2030-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2031-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2031-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2032-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2032-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2033-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2033-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2034-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2034-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2035-04-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2035-10-08",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2036-04-08",
        "cf": 36.94,
        "amort": 33
      },
      {
        "fecha": "2036-10-08",
        "cf": 2.64,
        "amort": 0
      },
      {
        "fecha": "2037-04-08",
        "cf": 35.64,
        "amort": 33
      },
      {
        "fecha": "2037-10-08",
        "cf": 1.34,
        "amort": 0
      },
      {
        "fecha": "2038-04-08",
        "cf": 35.34,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN40D - Pan American Energy 2026 u$s 2%",
    "ticker": "PN40O",
    "ley": "Local",
    "vencimiento": "13/10/2026",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-07-11",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-11",
        "cf": 100.5,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN42D - Pan American Energy 2027 u$s 6%",
    "ticker": "PN42O",
    "ley": "Local",
    "vencimiento": "17/04/2027",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-04-17",
        "cf": 2.99,
        "amort": 0
      },
      {
        "fecha": "2026-10-17",
        "cf": 3.01,
        "amort": 0
      },
      {
        "fecha": "2027-04-17",
        "cf": 102.99,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PNDCD - Pan American Energy 2027 u$s 9,125%",
    "ticker": "PNDCO",
    "ley": "NY",
    "vencimiento": "30/04/2027",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 22.74,
        "amort": 20
      },
      {
        "fecha": "2026-10-30",
        "cf": 21.83,
        "amort": 20
      },
      {
        "fecha": "2027-04-30",
        "cf": 20.91,
        "amort": 20
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN38D - Pan American Energy 2027 u$s 6,50%",
    "ticker": "PN38O",
    "ley": "Local",
    "vencimiento": "11/08/2027",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-08-11",
        "cf": 3.22,
        "amort": 0
      },
      {
        "fecha": "2027-02-11",
        "cf": 3.28,
        "amort": 0
      },
      {
        "fecha": "2027-08-11",
        "cf": 103.22,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN34D - Pan American Energy 2027 u$s 4,97%",
    "ticker": "PN34O",
    "ley": "Local",
    "vencimiento": "27/09/2027",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-27",
        "cf": 2.51,
        "amort": 0
      },
      {
        "fecha": "2027-03-27",
        "cf": 2.46,
        "amort": 0
      },
      {
        "fecha": "2027-09-27",
        "cf": 102.51,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN37D - Pan American Energy 2028 u$s 6,25%",
    "ticker": "PN37O",
    "ley": "Local",
    "vencimiento": "13/11/2028",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-05-13",
        "cf": 3.1,
        "amort": 0
      },
      {
        "fecha": "2026-11-13",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2027-05-13",
        "cf": 3.1,
        "amort": 0
      },
      {
        "fecha": "2027-11-15",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2028-05-15",
        "cf": 3.12,
        "amort": 0
      },
      {
        "fecha": "2028-11-13",
        "cf": 103.15,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN41D - Pan American Energy 2029 u$s 7,50%",
    "ticker": "PN41O",
    "ley": "Local",
    "vencimiento": "27/08/2029",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-08-27",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2027-02-27",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-08-27",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2028-02-27",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2028-08-27",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2029-02-27",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2029-08-27",
        "cf": 103.72,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN35D - Pan American Energy 2029 u$s 7%",
    "ticker": "PN35O",
    "ley": "Local",
    "vencimiento": "27/09/2029",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-27",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2027-03-27",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2027-09-27",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2028-03-27",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2028-09-27",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2029-03-27",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2029-09-27",
        "cf": 103.53,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PN36D - Pan American Energy 2031 u$s 7,25%",
    "ticker": "PN36O",
    "ley": "Local",
    "vencimiento": "13/11/2031",
    "lamina": 50,
    "cashflows": [
      {
        "fecha": "2026-05-13",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2026-11-13",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2027-05-13",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2027-11-15",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2028-05-15",
        "cf": 3.62,
        "amort": 0
      },
      {
        "fecha": "2028-11-13",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2029-05-14",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2029-11-13",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2030-05-13",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2030-11-13",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2031-05-13",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2031-11-13",
        "cf": 103.65,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pan American Energy",
    "titulo": "PNXCD - Pan American Energy 2032 u$s 8,50%",
    "ticker": "PNXCO",
    "ley": "NY",
    "vencimiento": "30/04/2032",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2026-10-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-11-01",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-05-02",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-10-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-04-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-10-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-04-30",
        "cf": 37.58,
        "amort": 33.33
      },
      {
        "fecha": "2030-10-30",
        "cf": 2.83,
        "amort": 0
      },
      {
        "fecha": "2031-04-30",
        "cf": 36.16,
        "amort": 33.33
      },
      {
        "fecha": "2031-10-30",
        "cf": 1.42,
        "amort": 0
      },
      {
        "fecha": "2032-04-30",
        "cf": 34.76,
        "amort": 33.34
      }
    ]
  },
  {
    "emisor": "TGS",
    "titulo": "TSC3D - Transportadora de Gas del Sur 2031 U$S 8,5%",
    "ticker": "TSC3O",
    "ley": "NY",
    "vencimiento": "24/07/2031",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-07-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-01-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-07-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-01-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-07-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-01-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-07-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-01-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-07-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2031-01-24",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2031-07-24",
        "cf": 104.25,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "TGS",
    "titulo": "TSC4D - Transportadora de Gas del Sur S.A.2035 U$S 7,75%",
    "ticker": "TSC4O",
    "ley": "NY",
    "vencimiento": "20/11/2035",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2026-11-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-11-23",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-05-22",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-11-21",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-05-21",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-11-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-11-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-11-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2032-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2032-11-23",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2033-05-20",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2033-11-22",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2034-05-22",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2034-11-21",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2035-05-21",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2035-11-20",
        "cf": 103.88,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "VALO",
    "titulo": "VBC1O - Banco de Valores 2027 u$s 7,50%",
    "ticker": "VBC1O",
    "ley": "Local",
    "vencimiento": "11/03/2027",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-09-11",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-03-11",
        "cf": 103.72,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Camuzzi",
    "titulo": "ZZC1D - Camuzzi Gas Pampeana 2027 u$s 7,95%",
    "ticker": "ZZC1O",
    "ley": "Local",
    "vencimiento": "22/02/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-21",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2027-02-21",
        "cf": 104.01,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Aeropuertos Arg.",
    "titulo": "ARC1D - Aeropuertos Argentina 2031 u$s 8,50%",
    "ticker": "ARC1O",
    "ley": "NY",
    "vencimiento": "01/08/2031",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-08-03",
        "cf": 2.98,
        "amort": 0.89
      },
      {
        "fecha": "2026-11-02",
        "cf": 2.07,
        "amort": 0
      },
      {
        "fecha": "2027-02-01",
        "cf": 6.85,
        "amort": 4.78
      },
      {
        "fecha": "2027-05-03",
        "cf": 4.7,
        "amort": 2.73
      },
      {
        "fecha": "2027-08-02",
        "cf": 6.14,
        "amort": 4.23
      },
      {
        "fecha": "2027-11-01",
        "cf": 5.11,
        "amort": 3.29
      },
      {
        "fecha": "2028-02-01",
        "cf": 7.39,
        "amort": 5.64
      },
      {
        "fecha": "2028-05-02",
        "cf": 5.12,
        "amort": 3.49
      },
      {
        "fecha": "2028-08-01",
        "cf": 1.56,
        "amort": 0
      },
      {
        "fecha": "2028-11-01",
        "cf": 6.62,
        "amort": 5.06
      },
      {
        "fecha": "2029-02-01",
        "cf": 8.56,
        "amort": 7.11
      },
      {
        "fecha": "2029-05-02",
        "cf": 6.26,
        "amort": 4.96
      },
      {
        "fecha": "2029-08-01",
        "cf": 7.78,
        "amort": 6.58
      },
      {
        "fecha": "2029-11-01",
        "cf": 6.65,
        "amort": 5.59
      },
      {
        "fecha": "2030-02-01",
        "cf": 8.32,
        "amort": 7.38
      },
      {
        "fecha": "2030-05-02",
        "cf": 6.05,
        "amort": 5.27
      },
      {
        "fecha": "2030-08-01",
        "cf": 7.55,
        "amort": 6.88
      },
      {
        "fecha": "2030-11-01",
        "cf": 6.43,
        "amort": 5.91
      },
      {
        "fecha": "2031-02-03",
        "cf": 8.51,
        "amort": 8.11
      },
      {
        "fecha": "2031-05-02",
        "cf": 6.21,
        "amort": 5.99
      },
      {
        "fecha": "2031-08-01",
        "cf": 4.66,
        "amort": 4.56
      }
    ]
  },
  {
    "emisor": "SIDERSA",
    "titulo": "SIC1D - Sidersa 2026 U$S 6,5%",
    "ticker": "SIC1O",
    "ley": "Local",
    "vencimiento": "09/12/2026",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-06-09",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2026-12-09",
        "cf": 103.26,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "SIDERSA",
    "titulo": "SIC2O - Sidersa Clase II - 2026",
    "ticker": "SIC2O",
    "ley": "Local",
    "vencimiento": "19/06/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-12-19",
        "cf": 3.76,
        "amort": 0
      },
      {
        "fecha": "2027-06-19",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2027-12-19",
        "cf": 3.76,
        "amort": 0
      },
      {
        "fecha": "2028-06-19",
        "cf": 3.76,
        "amort": 0
      },
      {
        "fecha": "2028-12-19",
        "cf": 3.76,
        "amort": 0
      },
      {
        "fecha": "2029-06-19",
        "cf": 103.74,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Mastellone Hermanos S.A.",
    "titulo": "MTC2O - Mastellone Hermanos S.A. - Clase 2 - Dolares",
    "ticker": "MTC2O",
    "ley": "Local",
    "vencimiento": "22/06/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-09-22",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2026-12-22",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2027-03-22",
        "cf": 1.6,
        "amort": 0
      },
      {
        "fecha": "2027-06-22",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-09-22",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-12-22",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2028-03-22",
        "cf": 1.62,
        "amort": 0
      },
      {
        "fecha": "2028-06-22",
        "cf": 101.64,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "TELECOM",
    "titulo": "Telecom 2027 Clase 25",
    "ticker": "TLCQO",
    "ley": "Local",
    "vencimiento": "02/07/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-10-02",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-01-02",
        "cf": 1.89,
        "amort": 0
      },
      {
        "fecha": "2027-04-02",
        "cf": 1.85,
        "amort": 0
      },
      {
        "fecha": "2027-07-02",
        "cf": 101.87,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "TELECOM",
    "titulo": "TLCWO - Telecom Argentina S.A. - Clase 30",
    "ticker": "TLCWO",
    "ley": "Local",
    "vencimiento": "29/05/2030",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-11-29",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2027-05-29",
        "cf": 3.1,
        "amort": 0
      },
      {
        "fecha": "2027-11-29",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2028-05-29",
        "cf": 3.12,
        "amort": 0
      },
      {
        "fecha": "2028-11-29",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2029-05-29",
        "cf": 3.1,
        "amort": 0
      },
      {
        "fecha": "2029-11-29",
        "cf": 3.15,
        "amort": 0
      },
      {
        "fecha": "2030-05-29",
        "cf": 103.1,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "TELECOM",
    "titulo": "TLCMO - Telecom 2031 u$s 9,50%",
    "ticker": "TLCMO",
    "ley": "NY",
    "vencimiento": "18/07/2031",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-07-18",
        "cf": 4.71,
        "amort": 0
      },
      {
        "fecha": "2027-01-18",
        "cf": 4.79,
        "amort": 0
      },
      {
        "fecha": "2027-07-18",
        "cf": 4.71,
        "amort": 0
      },
      {
        "fecha": "2028-01-18",
        "cf": 4.79,
        "amort": 0
      },
      {
        "fecha": "2028-07-18",
        "cf": 4.74,
        "amort": 0
      },
      {
        "fecha": "2029-01-18",
        "cf": 4.79,
        "amort": 0
      },
      {
        "fecha": "2029-07-18",
        "cf": 37.71,
        "amort": 33
      },
      {
        "fecha": "2030-01-18",
        "cf": 3.21,
        "amort": 0
      },
      {
        "fecha": "2030-07-18",
        "cf": 36.16,
        "amort": 33
      },
      {
        "fecha": "2031-01-18",
        "cf": 1.63,
        "amort": 0
      },
      {
        "fecha": "2031-07-18",
        "cf": 35.6,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "TELECOM",
    "titulo": "TLCPO - Telecom 2033 u$s 9,25%",
    "ticker": "TLCPO",
    "ley": "NY",
    "vencimiento": "30/05/2033",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2026-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2027-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2027-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2028-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2028-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2029-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2029-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2030-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2030-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2031-05-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2031-11-28",
        "cf": 4.63,
        "amort": 0
      },
      {
        "fecha": "2032-05-28",
        "cf": 54.63,
        "amort": 50
      },
      {
        "fecha": "2032-11-28",
        "cf": 2.31,
        "amort": 0
      },
      {
        "fecha": "2033-05-28",
        "cf": 52.31,
        "amort": 50
      }
    ]
  },
  {
    "emisor": "TELECOM",
    "titulo": "TLCTO - Telecom 2036 u$s 8,50%",
    "ticker": "TLCTO",
    "ley": "NY",
    "vencimiento": "21/01/2036",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-20",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2027-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2027-07-20",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2028-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2028-07-20",
        "cf": 4.24,
        "amort": 0
      },
      {
        "fecha": "2029-01-22",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2029-07-20",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2030-01-21",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2030-07-22",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2031-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2031-07-21",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2032-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2032-07-20",
        "cf": 4.24,
        "amort": 0
      },
      {
        "fecha": "2033-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2033-07-20",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2034-01-20",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2034-07-20",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2035-01-22",
        "cf": 54.28,
        "amort": 50
      },
      {
        "fecha": "2035-07-20",
        "cf": 2.11,
        "amort": 0
      },
      {
        "fecha": "2036-01-21",
        "cf": 52.14,
        "amort": 50
      }
    ]
  },
  {
    "emisor": "CNH Industrial Capital Argentina S.A.",
    "titulo": "CICBO - CNH Industrial Capital Argentina S.A. - Clase 11",
    "ticker": "CICBO",
    "ley": "Local",
    "vencimiento": "09/02/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-09",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2027-02-09",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-08-09",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2028-02-09",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2028-08-09",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2029-02-09",
        "cf": 103.78,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "BANCO COMAFI",
    "titulo": "Banco Comafi S.A. - Clase XVII - Dolares",
    "ticker": "AFCIO",
    "ley": "Local",
    "vencimiento": "07/11/2026",
    "lamina": 1100,
    "cashflows": [
      {
        "fecha": "2026-05-07",
        "cf": 3.22,
        "amort": 0
      },
      {
        "fecha": "2026-11-07",
        "cf": 103.28,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Tecpetrol",
    "titulo": "Tecpetrol S.A. - Clase 11 - Dolares",
    "ticker": "TTCBO",
    "ley": "NY",
    "vencimiento": "03/11/2027",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-04-16",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2026-10-16",
        "cf": 3.26,
        "amort": 0
      },
      {
        "fecha": "2027-04-16",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2027-10-16",
        "cf": 103.26,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Tecpetrol",
    "titulo": "Tecpetrol S.A. - Clase 9 - Dolares",
    "ticker": "TTC9O",
    "ley": "Local",
    "vencimiento": "24/10/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-10-24",
        "cf": 3.41,
        "amort": 0
      },
      {
        "fecha": "2027-04-24",
        "cf": 3.39,
        "amort": 0
      },
      {
        "fecha": "2027-10-24",
        "cf": 3.41,
        "amort": 0
      },
      {
        "fecha": "2028-04-24",
        "cf": 3.41,
        "amort": 0
      },
      {
        "fecha": "2028-10-24",
        "cf": 3.41,
        "amort": 0
      },
      {
        "fecha": "2029-04-24",
        "cf": 3.39,
        "amort": 0
      },
      {
        "fecha": "2029-10-24",
        "cf": 103.41,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Tecpetrol",
    "titulo": "Tecpetrol S.A. - Clase 12 - Dolares",
    "ticker": "TTCDO",
    "ley": "NY",
    "vencimiento": "03/11/2030",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-05-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2026-11-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-05-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-11-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-05-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-11-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-05-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-11-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-05-03",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-11-03",
        "cf": 103.81,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Tecpetrol",
    "titulo": "Tecpetrol S.A. - Clase 10 - Dolares",
    "ticker": "TTCAO",
    "ley": "NY",
    "vencimiento": "22/01/2033",
    "lamina": 10000,
    "cashflows": [
      {
        "fecha": "2026-07-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-01-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2027-07-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-01-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2028-07-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-01-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2029-07-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-01-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2030-07-22",
        "cf": 3.81,
        "amort": 0
      },
      {
        "fecha": "2031-01-22",
        "cf": 36.81,
        "amort": 33
      },
      {
        "fecha": "2031-07-22",
        "cf": 2.55,
        "amort": 0
      },
      {
        "fecha": "2032-01-22",
        "cf": 35.55,
        "amort": 33
      },
      {
        "fecha": "2032-07-22",
        "cf": 1.3,
        "amort": 0
      },
      {
        "fecha": "2033-01-22",
        "cf": 35.3,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "IRSA",
    "titulo": "IRSA Inversiones y Representaciones S.A - Clase XVIII",
    "ticker": "IRCJO",
    "ley": "Local",
    "vencimiento": "28/02/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-28",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2027-02-28",
        "cf": 103.53,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "IRSA",
    "titulo": "IRSA Inversiones y Representaciones S.A. - Clase XXII",
    "ticker": "IRCNO",
    "ley": "Local",
    "vencimiento": "23/10/2027",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-07-23",
        "cf": 2.85,
        "amort": 0
      },
      {
        "fecha": "2027-01-23",
        "cf": 2.9,
        "amort": 0
      },
      {
        "fecha": "2027-07-23",
        "cf": 2.85,
        "amort": 0
      },
      {
        "fecha": "2027-10-23",
        "cf": 101.45,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "IRSA",
    "titulo": "IRSA Inversiones y Representaciones S.A.. - Clase XIV",
    "ticker": "IRCFO",
    "ley": "NY",
    "vencimiento": "22/06/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-06-22",
        "cf": 20.34,
        "amort": 17.5
      },
      {
        "fecha": "2026-12-22",
        "cf": 2.08,
        "amort": 0
      },
      {
        "fecha": "2027-06-22",
        "cf": 19.58,
        "amort": 17.5
      },
      {
        "fecha": "2027-12-22",
        "cf": 1.31,
        "amort": 0
      },
      {
        "fecha": "2028-06-22",
        "cf": 31.31,
        "amort": 30
      }
    ]
  },
  {
    "emisor": "IRSA",
    "titulo": "IRSA Inversiones y Representaciones S.A. - Clase XXIII",
    "ticker": "IRCOO",
    "ley": "Local",
    "vencimiento": "23/10/2029",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-07-23",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2027-01-23",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2027-07-23",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2028-01-23",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2028-07-23",
        "cf": 3.62,
        "amort": 0
      },
      {
        "fecha": "2029-01-23",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2029-07-23",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2029-10-23",
        "cf": 101.83,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "IRSA",
    "titulo": "IRCPO - IRSA Inversiones y Representaciones S.A. - Clase XXIV - Dolares",
    "ticker": "IRCPO",
    "ley": "Local",
    "vencimiento": "31/03/2035",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2027-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2027-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2028-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2028-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2029-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2029-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2030-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2030-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2031-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2031-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2032-03-31",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2032-09-30",
        "cf": 4,
        "amort": 0
      },
      {
        "fecha": "2033-03-31",
        "cf": 37,
        "amort": 33
      },
      {
        "fecha": "2033-09-30",
        "cf": 2.68,
        "amort": 0
      },
      {
        "fecha": "2034-03-31",
        "cf": 35.68,
        "amort": 33
      },
      {
        "fecha": "2034-09-30",
        "cf": 1.36,
        "amort": 0
      },
      {
        "fecha": "2035-03-31",
        "cf": 35.36,
        "amort": 34
      }
    ]
  },
  {
    "emisor": "PECOM",
    "titulo": "PECOM Servicios Energía Clase I u$s",
    "ticker": "MCC1O",
    "ley": "Local",
    "vencimiento": "10/03/2029",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2027-03-10",
        "cf": 3.92,
        "amort": 0
      },
      {
        "fecha": "2027-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2028-03-10",
        "cf": 3.94,
        "amort": 0
      },
      {
        "fecha": "2028-09-10",
        "cf": 3.98,
        "amort": 0
      },
      {
        "fecha": "2029-03-10",
        "cf": 103.92,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "PECOM",
    "titulo": "PECOM Servicios Energía Clase II u$s",
    "ticker": "MCC2O",
    "ley": "Local",
    "vencimiento": "02/06/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-06-02",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2026-12-02",
        "cf": 3.76,
        "amort": 0
      },
      {
        "fecha": "2027-06-02",
        "cf": 103.74,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "PECOM",
    "titulo": "PECOM Servicios Energía Clase III u$s",
    "ticker": "MCC3O",
    "ley": "Local",
    "vencimiento": "11/05/2030",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-11-11",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-05-11",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2027-11-11",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2028-05-11",
        "cf": 3.74,
        "amort": 0
      },
      {
        "fecha": "2028-11-11",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2029-05-11",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2029-11-11",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2030-05-11",
        "cf": 103.72,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "John Deere - Clase XIV - Dólares",
    "ticker": "HJCFO",
    "ley": "Local",
    "vencimiento": "21/10/2026",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-10-21",
        "cf": 102.51,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "John Deere Clase XVII u$s",
    "ticker": "HJCIO",
    "ley": "Local",
    "vencimiento": "27/05/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2025-11-27",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2026-05-27",
        "cf": 3.72,
        "amort": 0
      },
      {
        "fecha": "2026-11-27",
        "cf": 3.78,
        "amort": 0
      },
      {
        "fecha": "2027-05-27",
        "cf": 103.72,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "John Deere Clase XVIII u$s",
    "ticker": "HJCJO",
    "ley": "Local",
    "vencimiento": "26/07/2027",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-01-26",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2026-07-27",
        "cf": 4.22,
        "amort": 0
      },
      {
        "fecha": "2027-01-25",
        "cf": 4.28,
        "amort": 0
      },
      {
        "fecha": "2027-07-26",
        "cf": 104.22,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "HJCHO - John Deere - Clase XVI - Dolares",
    "ticker": "HJCHO",
    "ley": "Local",
    "vencimiento": "17/01/2028",
    "lamina": 1200,
    "cashflows": [
      {
        "fecha": "2027-01-17",
        "cf": 3.53,
        "amort": 0
      },
      {
        "fecha": "2027-07-17",
        "cf": 3.47,
        "amort": 0
      },
      {
        "fecha": "2028-01-17",
        "cf": 103.53,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "John Deere Clase XX u$s",
    "ticker": "HJCLO",
    "ley": "Local",
    "vencimiento": "08/12/2028",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-12-08",
        "cf": 3.26,
        "amort": 0
      },
      {
        "fecha": "2027-06-08",
        "cf": 3.24,
        "amort": 0
      },
      {
        "fecha": "2027-12-08",
        "cf": 3.26,
        "amort": 0
      },
      {
        "fecha": "2028-06-08",
        "cf": 3.26,
        "amort": 0
      },
      {
        "fecha": "2028-12-08",
        "cf": 103.26,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "John Deere",
    "titulo": "John Deere Clase XIX u$s",
    "ticker": "HJCKO",
    "ley": "Local",
    "vencimiento": "16/01/2029",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-07-16",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2027-01-18",
        "cf": 3.91,
        "amort": 0
      },
      {
        "fecha": "2027-07-16",
        "cf": 3.84,
        "amort": 0
      },
      {
        "fecha": "2028-01-17",
        "cf": 3.91,
        "amort": 0
      },
      {
        "fecha": "2028-07-17",
        "cf": 3.86,
        "amort": 0
      },
      {
        "fecha": "2029-01-16",
        "cf": 103.91,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "LEDESMA",
    "titulo": "LDCGO - Ledesma Clase 15 u$s",
    "ticker": "LDCGO",
    "ley": "Local",
    "vencimiento": "04/10/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-04",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2026-11-04",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2027-02-04",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2027-05-04",
        "cf": 1.71,
        "amort": 0
      },
      {
        "fecha": "2027-08-04",
        "cf": 1.76,
        "amort": 0
      },
      {
        "fecha": "2027-10-04",
        "cf": 101.17,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Banco Galicia",
    "titulo": "BYCWO - Banco de Galicia Clase XXX u$s",
    "ticker": "BYCWO",
    "ley": "Local",
    "vencimiento": "30/11/2026",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-11-30",
        "cf": 103.29,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Banco Galicia",
    "titulo": "BYZ1O - Banco Galicia Clase XXXIII - Serie I u$s",
    "ticker": "BYZ1O",
    "ley": "Local",
    "vencimiento": "02/08/2027",
    "lamina": 1200,
    "cashflows": [
      {
        "fecha": "2026-07-30",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2027-01-30",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-08-02",
        "cf": 101.64,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Banco Galicia",
    "titulo": "BYZ2O - Banco Galicia Clase XXXIII - Serie II u$s",
    "ticker": "BYZ2O",
    "ley": "Local",
    "vencimiento": "30/07/2029",
    "lamina": 1200,
    "cashflows": [
      {
        "fecha": "2026-07-30",
        "cf": 0,
        "amort": 0
      },
      {
        "fecha": "2027-01-30",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2027-07-30",
        "cf": 2.73,
        "amort": 0
      },
      {
        "fecha": "2028-01-30",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2028-07-30",
        "cf": 2.74,
        "amort": 0
      },
      {
        "fecha": "2029-01-30",
        "cf": 2.77,
        "amort": 0
      },
      {
        "fecha": "2029-07-30",
        "cf": 102.73,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pluspetrol",
    "titulo": "PLC1O - Pluspetrol Clase 1 - Dolares",
    "ticker": "PLC1O",
    "ley": "Local",
    "vencimiento": "27/01/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2027-04-27",
        "cf": 2.99,
        "amort": 0
      },
      {
        "fecha": "2027-10-27",
        "cf": 3.01,
        "amort": 0
      },
      {
        "fecha": "2028-01-27",
        "cf": 101.51,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pluspetrol",
    "titulo": "PLC3O - Pluspetrol Clase 3 - Dólares",
    "ticker": "PLC3O",
    "ley": "Local",
    "vencimiento": "30/04/2028",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-30",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2027-01-30",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2027-07-30",
        "cf": 3.6,
        "amort": 0
      },
      {
        "fecha": "2028-01-30",
        "cf": 3.65,
        "amort": 0
      },
      {
        "fecha": "2028-04-30",
        "cf": 101.81,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pluspetrol",
    "titulo": "PLC5O - Pluspetrol Clase 5 - Dólares",
    "ticker": "PLC5O",
    "ley": "NY",
    "vencimiento": "18/05/2031",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-11-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2027-05-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2027-11-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2028-05-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2028-11-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2029-05-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2029-11-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2030-05-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2030-11-18",
        "cf": 4.06,
        "amort": 0
      },
      {
        "fecha": "2031-05-18",
        "cf": 104.06,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Pluspetrol",
    "titulo": "PLC4O - Pluspetrol Clase 4 - Dolares",
    "ticker": "PLC4O",
    "ley": "NY",
    "vencimiento": "30/05/2032",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-05-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2027-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-05-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2028-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-05-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2029-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-05-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2030-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2031-05-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2031-11-30",
        "cf": 4.25,
        "amort": 0
      },
      {
        "fecha": "2032-05-30",
        "cf": 104.25,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "SAMI",
    "titulo": "SNEBO - San Miguel Serie XIII Clase B u$s",
    "ticker": "SNEBO",
    "ley": "Local",
    "vencimiento": "14/07/2029",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-07-14",
        "cf": 3.37,
        "amort": 0
      },
      {
        "fecha": "2027-01-14",
        "cf": 3.43,
        "amort": 0
      },
      {
        "fecha": "2027-07-14",
        "cf": 7.62,
        "amort": 4.25
      },
      {
        "fecha": "2028-01-14",
        "cf": 7.51,
        "amort": 4.25
      },
      {
        "fecha": "2028-07-14",
        "cf": 11.55,
        "amort": 8.5
      },
      {
        "fecha": "2029-01-14",
        "cf": 11.24,
        "amort": 8.5
      },
      {
        "fecha": "2029-07-14",
        "cf": 61.86,
        "amort": 59.5
      }
    ]
  },
  {
    "emisor": "SCANIA",
    "titulo": "SBC1O - Scania Credit Argentina Clase 1 u$s",
    "ticker": "SBC1O",
    "ley": "Local",
    "vencimiento": "05/09/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-06-05",
        "cf": 15.9,
        "amort": 14
      },
      {
        "fecha": "2026-09-05",
        "cf": 15.59,
        "amort": 14
      },
      {
        "fecha": "2026-12-05",
        "cf": 15.27,
        "amort": 14
      },
      {
        "fecha": "2027-03-05",
        "cf": 14.95,
        "amort": 14
      },
      {
        "fecha": "2027-06-05",
        "cf": 14.66,
        "amort": 14
      },
      {
        "fecha": "2027-09-05",
        "cf": 16.35,
        "amort": 16
      }
    ]
  },
  {
    "emisor": "Banco Hipotecario",
    "titulo": "HBCFO Banco Hipotecario Clase 14 u$s",
    "ticker": "HBCFO",
    "ley": "Local",
    "vencimiento": "23/02/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-08-23",
        "cf": 2.48,
        "amort": 0
      },
      {
        "fecha": "2027-02-23",
        "cf": 102.52,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "IEB Construcciones S.A.",
    "titulo": "IES1MO - IEB Construcciones S.A. - Clase I - Dolares",
    "ticker": "IES1MO",
    "ley": "Local",
    "vencimiento": "10/08/2027",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-11-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-02-10",
        "cf": 1.64,
        "amort": 0
      },
      {
        "fecha": "2027-05-10",
        "cf": 1.58,
        "amort": 0
      },
      {
        "fecha": "2027-08-10",
        "cf": 101.64,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Banco de Córdoba",
    "titulo": "COC4O - Banco de Cordoba - Clase IV - Dolares",
    "ticker": "COC4O",
    "ley": "Local",
    "vencimiento": "10/08/2029",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2027-02-10",
        "cf": 3,
        "amort": 0
      },
      {
        "fecha": "2027-08-10",
        "cf": 2.95,
        "amort": 0
      },
      {
        "fecha": "2028-02-10",
        "cf": 3,
        "amort": 0
      },
      {
        "fecha": "2028-08-10",
        "cf": 2.97,
        "amort": 0
      },
      {
        "fecha": "2029-02-10",
        "cf": 3,
        "amort": 0
      },
      {
        "fecha": "2029-08-10",
        "cf": 102.95,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "Generacion Litoral S.A.",
    "titulo": "GOC4O - Generacion Litoral S.A. - Clase IV - Dolares",
    "ticker": "GOC4O",
    "ley": "Local",
    "vencimiento": "28/10/2030",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-28",
        "cf": 0.93,
        "amort": 0
      },
      {
        "fecha": "2026-10-28",
        "cf": 0.9,
        "amort": 0
      },
      {
        "fecha": "2026-11-28",
        "cf": 0.93,
        "amort": 0
      },
      {
        "fecha": "2026-12-28",
        "cf": 0.9,
        "amort": 0
      },
      {
        "fecha": "2027-01-28",
        "cf": 0.93,
        "amort": 0
      },
      {
        "fecha": "2027-02-28",
        "cf": 0.93,
        "amort": 0
      },
      {
        "fecha": "2027-03-28",
        "cf": 0.84,
        "amort": 0
      },
      {
        "fecha": "2027-04-28",
        "cf": 0.93,
        "amort": 0
      },
      {
        "fecha": "2027-05-28",
        "cf": 2.9,
        "amort": 2
      },
      {
        "fecha": "2027-06-28",
        "cf": 2.92,
        "amort": 2
      },
      {
        "fecha": "2027-07-28",
        "cf": 2.87,
        "amort": 2
      },
      {
        "fecha": "2027-08-28",
        "cf": 2.88,
        "amort": 2
      },
      {
        "fecha": "2027-09-28",
        "cf": 2.86,
        "amort": 2
      },
      {
        "fecha": "2027-10-28",
        "cf": 2.81,
        "amort": 2
      },
      {
        "fecha": "2027-11-28",
        "cf": 2.82,
        "amort": 2
      },
      {
        "fecha": "2027-12-28",
        "cf": 2.78,
        "amort": 2
      },
      {
        "fecha": "2028-01-28",
        "cf": 2.78,
        "amort": 2
      },
      {
        "fecha": "2028-02-28",
        "cf": 2.77,
        "amort": 2
      },
      {
        "fecha": "2028-03-28",
        "cf": 2.7,
        "amort": 2
      },
      {
        "fecha": "2028-04-28",
        "cf": 2.73,
        "amort": 2
      },
      {
        "fecha": "2028-05-28",
        "cf": 2.94,
        "amort": 2.25
      },
      {
        "fecha": "2028-06-28",
        "cf": 2.94,
        "amort": 2.25
      },
      {
        "fecha": "2028-07-28",
        "cf": 2.9,
        "amort": 2.25
      },
      {
        "fecha": "2028-08-28",
        "cf": 2.9,
        "amort": 2.25
      },
      {
        "fecha": "2028-09-28",
        "cf": 2.88,
        "amort": 2.25
      },
      {
        "fecha": "2028-10-28",
        "cf": 2.84,
        "amort": 2.25
      },
      {
        "fecha": "2028-11-28",
        "cf": 2.83,
        "amort": 2.25
      },
      {
        "fecha": "2028-12-28",
        "cf": 2.79,
        "amort": 2.25
      },
      {
        "fecha": "2029-01-28",
        "cf": 2.79,
        "amort": 2.25
      },
      {
        "fecha": "2029-02-28",
        "cf": 2.77,
        "amort": 2.25
      },
      {
        "fecha": "2029-03-28",
        "cf": 2.7,
        "amort": 2.25
      },
      {
        "fecha": "2029-04-28",
        "cf": 2.73,
        "amort": 2.25
      },
      {
        "fecha": "2029-05-28",
        "cf": 2.94,
        "amort": 2.5
      },
      {
        "fecha": "2029-06-28",
        "cf": 2.93,
        "amort": 2.5
      },
      {
        "fecha": "2029-07-28",
        "cf": 2.9,
        "amort": 2.5
      },
      {
        "fecha": "2029-08-28",
        "cf": 2.89,
        "amort": 2.5
      },
      {
        "fecha": "2029-09-28",
        "cf": 2.86,
        "amort": 2.5
      },
      {
        "fecha": "2029-10-28",
        "cf": 2.83,
        "amort": 2.5
      },
      {
        "fecha": "2029-11-28",
        "cf": 2.82,
        "amort": 2.5
      },
      {
        "fecha": "2029-12-28",
        "cf": 2.78,
        "amort": 2.5
      },
      {
        "fecha": "2020-01-28",
        "cf": 2.77,
        "amort": 2.5
      },
      {
        "fecha": "2030-02-28",
        "cf": 2.75,
        "amort": 2.5
      },
      {
        "fecha": "2030-03-28",
        "cf": 2.7,
        "amort": 2.5
      },
      {
        "fecha": "2030-04-28",
        "cf": 2.7,
        "amort": 2.5
      },
      {
        "fecha": "2030-05-28",
        "cf": 2.67,
        "amort": 2.5
      },
      {
        "fecha": "2030-06-28",
        "cf": 2.65,
        "amort": 2.5
      },
      {
        "fecha": "2030-07-28",
        "cf": 2.63,
        "amort": 2.5
      },
      {
        "fecha": "2030-08-28",
        "cf": 2.61,
        "amort": 2.5
      },
      {
        "fecha": "2030-09-28",
        "cf": 2.58,
        "amort": 2.5
      },
      {
        "fecha": "2030-10-28",
        "cf": 6.56,
        "amort": 6.5
      }
    ]
  },
  {
    "emisor": "Petrolera Aconcagua Energía S.A.",
    "titulo": "PECNO - Petrolera Aconcagua Energia S.A. - Clase XXII - Dolares",
    "ticker": "PECNO",
    "ley": "Local",
    "vencimiento": "25/08/2032",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2027-08-25",
        "cf": 3,
        "amort": 0
      },
      {
        "fecha": "2028-08-25",
        "cf": 3.01,
        "amort": 0
      },
      {
        "fecha": "2029-08-25",
        "cf": 5,
        "amort": 0
      },
      {
        "fecha": "2030-08-25",
        "cf": 26,
        "amort": 20
      },
      {
        "fecha": "2031-08-25",
        "cf": 25.6,
        "amort": 20
      },
      {
        "fecha": "2032-08-25",
        "cf": 64.21,
        "amort": 60
      }
    ]
  },
  {
    "emisor": "Banco Supervielle S.A.",
    "titulo": "BPCUO - Banco Supervielle S.A. - Clase U - Dolares",
    "ticker": "BPCUO",
    "ley": "Local",
    "vencimiento": "04/12/2026",
    "lamina": 1200,
    "cashflows": [
      {
        "fecha": "2026-12-04",
        "cf": 103.13,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "YPF Luz",
    "titulo": "YFCOO - YPF Energia Electrica S.A. - Clase XXIII - Dolares",
    "ticker": "YFCOO",
    "ley": "Local",
    "vencimiento": "15/12/2028",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-09-15",
        "cf": 5.06,
        "amort": 0
      },
      {
        "fecha": "2026-12-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2027-03-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2027-06-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2027-09-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2027-12-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2028-03-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2028-06-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2028-09-15",
        "cf": 1.69,
        "amort": 0
      },
      {
        "fecha": "2028-12-15",
        "cf": 101.69,
        "amort": 100
      }
    ]
  },
  {
    "emisor": "MSU Energy S.A.",
    "titulo": "RUCDO - MSU Energy S.A. - Clase XII - Serie B",
    "ticker": "RUCDO",
    "ley": "NY",
    "vencimiento": "05/12/2030",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-12-05",
        "cf": 4.88,
        "amort": 0
      },
      {
        "fecha": "2027-06-05",
        "cf": 4.88,
        "amort": 0
      },
      {
        "fecha": "2027-12-05",
        "cf": 4.88,
        "amort": 0
      },
      {
        "fecha": "2028-06-05",
        "cf": 4.88,
        "amort": 0
      },
      {
        "fecha": "2028-12-05",
        "cf": 22.38,
        "amort": 17.5
      },
      {
        "fecha": "2029-06-05",
        "cf": 4.02,
        "amort": 0
      },
      {
        "fecha": "2029-12-05",
        "cf": 21.52,
        "amort": 17.5
      },
      {
        "fecha": "2030-06-05",
        "cf": 3.17,
        "amort": 0
      },
      {
        "fecha": "2030-12-05",
        "cf": 68.17,
        "amort": 65
      }
    ]
  },
  {
    "emisor": "Genneia S.A.",
    "titulo": "GN49D - Genneia S.A. Clase XLIX - Dolares",
    "ticker": "GN49O",
    "ley": "NY",
    "vencimiento": "02/12/2033",
    "lamina": 1000,
    "cashflows": [
      {
        "fecha": "2026-12-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-06-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2027-12-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-06-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2028-12-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-06-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2029-12-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-06-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2030-12-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-06-02",
        "cf": 3.88,
        "amort": 0
      },
      {
        "fecha": "2031-12-02",
        "cf": 36.88,
        "amort": 33
      },
      {
        "fecha": "2032-06-02",
        "cf": 2.6,
        "amort": 0
      },
      {
        "fecha": "2032-12-02",
        "cf": 35.6,
        "amort": 33
      },
      {
        "fecha": "2033-06-02",
        "cf": 1.32,
        "amort": 0
      },
      {
        "fecha": "2033-12-02",
        "cf": 35.32,
        "amort": 34
      }
    ]
  }
];

export const SOVEREIGN_BONDS: SovereignBond[] = [
  {
    "grupo": "Globales",
    "ticker": "GD29D",
    "titulo": "Bono Global Rep. Argentina 2029 u$s",
    "ley": "NY",
    "vencimiento": "09/07/2029",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 10.35,
        "amort": 10
      },
      {
        "fecha": "2027-01-09",
        "cf": 10.3,
        "amort": 10
      },
      {
        "fecha": "2027-07-09",
        "cf": 10.25,
        "amort": 10
      },
      {
        "fecha": "2028-01-09",
        "cf": 10.2,
        "amort": 10
      },
      {
        "fecha": "2028-07-09",
        "cf": 10.15,
        "amort": 10
      },
      {
        "fecha": "2029-01-09",
        "cf": 10.1,
        "amort": 10
      },
      {
        "fecha": "2029-07-09",
        "cf": 10.05,
        "amort": 10
      }
    ]
  },
  {
    "grupo": "Globales",
    "ticker": "GD30D",
    "titulo": "Bono Global Rep. Argentina 2030 u$s",
    "ley": "NY",
    "vencimiento": "30/11/2029",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 8.27,
        "amort": 8
      },
      {
        "fecha": "2027-01-09",
        "cf": 8.24,
        "amort": 8
      },
      {
        "fecha": "2027-07-09",
        "cf": 8.21,
        "amort": 8
      },
      {
        "fecha": "2028-01-09",
        "cf": 8.42,
        "amort": 8
      },
      {
        "fecha": "2028-07-09",
        "cf": 8.35,
        "amort": 8
      },
      {
        "fecha": "2029-01-09",
        "cf": 8.28,
        "amort": 8
      },
      {
        "fecha": "2029-07-09",
        "cf": 8.21,
        "amort": 8
      },
      {
        "fecha": "2030-01-09",
        "cf": 8.14,
        "amort": 8
      },
      {
        "fecha": "2030-07-09",
        "cf": 8.07,
        "amort": 8
      }
    ]
  },
  {
    "grupo": "Globales",
    "ticker": "GD35D",
    "titulo": "Bono Global Rep. Argentina 2035 u$s",
    "ley": "NY",
    "vencimiento": "09/07/2035",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2027-07-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2028-01-09",
        "cf": 2.37,
        "amort": 0
      },
      {
        "fecha": "2028-07-09",
        "cf": 2.37,
        "amort": 0
      },
      {
        "fecha": "2029-01-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2029-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2030-01-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2030-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2031-01-09",
        "cf": 12.5,
        "amort": 10
      },
      {
        "fecha": "2031-07-09",
        "cf": 12.25,
        "amort": 10
      },
      {
        "fecha": "2032-01-09",
        "cf": 12.2,
        "amort": 10
      },
      {
        "fecha": "2032-07-09",
        "cf": 11.75,
        "amort": 10
      },
      {
        "fecha": "2033-01-09",
        "cf": 11.5,
        "amort": 10
      },
      {
        "fecha": "2033-07-09",
        "cf": 11.25,
        "amort": 10
      },
      {
        "fecha": "2034-01-09",
        "cf": 11.2,
        "amort": 10
      },
      {
        "fecha": "2034-07-09",
        "cf": 10.75,
        "amort": 10
      },
      {
        "fecha": "2035-01-09",
        "cf": 10.5,
        "amort": 10
      },
      {
        "fecha": "2035-07-09",
        "cf": 10.25,
        "amort": 10
      }
    ]
  },
  {
    "grupo": "Globales",
    "ticker": "GD38D",
    "titulo": "Bono Global Rep. Argentina 2038 u$s",
    "ley": "NY",
    "vencimiento": "09/01/2038",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-07-09",
        "cf": 7.05,
        "amort": 4.5
      },
      {
        "fecha": "2028-01-09",
        "cf": 6.94,
        "amort": 4.5
      },
      {
        "fecha": "2028-07-09",
        "cf": 6.82,
        "amort": 4.55
      },
      {
        "fecha": "2029-01-09",
        "cf": 6.71,
        "amort": 4.55
      },
      {
        "fecha": "2029-07-09",
        "cf": 6.6,
        "amort": 4.55
      },
      {
        "fecha": "2030-01-09",
        "cf": 6.48,
        "amort": 4.55
      },
      {
        "fecha": "2030-07-09",
        "cf": 6.37,
        "amort": 4.55
      },
      {
        "fecha": "2031-01-09",
        "cf": 6.25,
        "amort": 4.55
      },
      {
        "fecha": "2031-07-09",
        "cf": 6.14,
        "amort": 4.55
      },
      {
        "fecha": "2032-01-09",
        "cf": 6.03,
        "amort": 4.55
      },
      {
        "fecha": "2032-07-09",
        "cf": 5.91,
        "amort": 4.55
      },
      {
        "fecha": "2033-01-09",
        "cf": 5.8,
        "amort": 4.55
      },
      {
        "fecha": "2033-07-09",
        "cf": 5.69,
        "amort": 4.55
      },
      {
        "fecha": "2034-01-09",
        "cf": 5.57,
        "amort": 4.55
      },
      {
        "fecha": "2034-07-09",
        "cf": 5.46,
        "amort": 4.55
      },
      {
        "fecha": "2035-01-09",
        "cf": 5.35,
        "amort": 4.55
      },
      {
        "fecha": "2035-07-09",
        "cf": 5.23,
        "amort": 4.55
      },
      {
        "fecha": "2036-01-09",
        "cf": 5.12,
        "amort": 4.55
      },
      {
        "fecha": "2036-07-09",
        "cf": 5,
        "amort": 4.55
      },
      {
        "fecha": "2037-01-09",
        "cf": 4.89,
        "amort": 4.55
      },
      {
        "fecha": "2037-07-09",
        "cf": 4.78,
        "amort": 4.55
      },
      {
        "fecha": "2038-01-09",
        "cf": 4.66,
        "amort": 4.55
      }
    ]
  },
  {
    "grupo": "Globales",
    "emisor": "República Argentina",
    "titulo": "Bono Global Rep. Argentina 2041 u$s",
    "ticker": "GD41D",
    "ley": "NY",
    "vencimiento": "09/01/2041",
    "lamina": 100,
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2027-07-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2028-01-09",
        "cf": 5.32,
        "amort": 3.57
      },
      {
        "fecha": "2028-07-09",
        "cf": 5.26,
        "amort": 3.57
      },
      {
        "fecha": "2029-01-09",
        "cf": 5.2,
        "amort": 3.57
      },
      {
        "fecha": "2029-07-09",
        "cf": 5.13,
        "amort": 3.57
      },
      {
        "fecha": "2030-01-09",
        "cf": 5.66,
        "amort": 3.57
      },
      {
        "fecha": "2030-07-09",
        "cf": 5.57,
        "amort": 3.57
      },
      {
        "fecha": "2031-01-09",
        "cf": 5.49,
        "amort": 3.57
      },
      {
        "fecha": "2031-07-09",
        "cf": 5.4,
        "amort": 3.57
      },
      {
        "fecha": "2032-01-09",
        "cf": 5.31,
        "amort": 3.57
      },
      {
        "fecha": "2032-07-09",
        "cf": 5.22,
        "amort": 3.57
      },
      {
        "fecha": "2033-01-09",
        "cf": 5.14,
        "amort": 3.57
      },
      {
        "fecha": "2033-07-09",
        "cf": 5.05,
        "amort": 3.57
      },
      {
        "fecha": "2034-01-09",
        "cf": 4.96,
        "amort": 3.57
      },
      {
        "fecha": "2034-07-09",
        "cf": 4.88,
        "amort": 3.57
      },
      {
        "fecha": "2035-01-09",
        "cf": 4.79,
        "amort": 3.57
      },
      {
        "fecha": "2035-07-09",
        "cf": 4.7,
        "amort": 3.57
      },
      {
        "fecha": "2036-01-09",
        "cf": 4.61,
        "amort": 3.57
      },
      {
        "fecha": "2036-07-09",
        "cf": 4.53,
        "amort": 3.57
      },
      {
        "fecha": "2037-01-09",
        "cf": 4.44,
        "amort": 3.57
      },
      {
        "fecha": "2037-07-09",
        "cf": 4.35,
        "amort": 3.57
      },
      {
        "fecha": "2038-01-09",
        "cf": 4.27,
        "amort": 3.57
      },
      {
        "fecha": "2038-07-09",
        "cf": 4.18,
        "amort": 3.57
      },
      {
        "fecha": "2039-01-09",
        "cf": 4.09,
        "amort": 3.57
      },
      {
        "fecha": "2039-07-09",
        "cf": 4.01,
        "amort": 3.57
      },
      {
        "fecha": "2040-01-09",
        "cf": 3.92,
        "amort": 3.58
      },
      {
        "fecha": "2040-07-09",
        "cf": 3.83,
        "amort": 3.58
      },
      {
        "fecha": "2041-01-09",
        "cf": 3.74,
        "amort": 3.58
      },
      {
        "fecha": "2041-07-09",
        "cf": 3.66,
        "amort": 3.58
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AO27D",
    "titulo": "Bono Dólar BONAR 2027 (AO27D)",
    "ley": "Local",
    "vencimiento": "29/10/2027",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-05-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2026-06-30",
        "cf": 0.52,
        "amort": 0
      },
      {
        "fecha": "2026-07-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-11-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-12-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-01-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2027-02-26",
        "cf": 0.45,
        "amort": 0
      },
      {
        "fecha": "2027-03-31",
        "cf": 0.58,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-05-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-06-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-07-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-10-29",
        "cf": 100.48,
        "amort": 100
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AO28D",
    "titulo": "Bono Dólar BONAR 2028 (AO28D)",
    "ley": "Local",
    "vencimiento": "29/10/2028",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-05-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2026-06-30",
        "cf": 0.52,
        "amort": 0
      },
      {
        "fecha": "2026-07-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-11-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-12-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-01-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2027-02-26",
        "cf": 0.45,
        "amort": 0
      },
      {
        "fecha": "2027-03-31",
        "cf": 0.58,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-05-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-06-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-07-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-10-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2027-11-30",
        "cf": 0.52,
        "amort": 0
      },
      {
        "fecha": "2027-12-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-01-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-02-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2028-03-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-04-28",
        "cf": 0.47,
        "amort": 0
      },
      {
        "fecha": "2028-05-31",
        "cf": 0.55,
        "amort": 0
      },
      {
        "fecha": "2028-06-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-07-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-09-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2028-10-31",
        "cf": 100.53,
        "amort": 100
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AL29D",
    "titulo": "Bono AL 2029 u$s Local (AL29D)",
    "ley": "Local",
    "vencimiento": "09/07/2029",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 10.35,
        "amort": 10
      },
      {
        "fecha": "2027-01-09",
        "cf": 10.3,
        "amort": 10
      },
      {
        "fecha": "2027-07-09",
        "cf": 10.25,
        "amort": 10
      },
      {
        "fecha": "2028-01-09",
        "cf": 10.2,
        "amort": 10
      },
      {
        "fecha": "2028-07-09",
        "cf": 10.15,
        "amort": 10
      },
      {
        "fecha": "2029-01-09",
        "cf": 10.1,
        "amort": 10
      },
      {
        "fecha": "2029-07-09",
        "cf": 10.05,
        "amort": 10
      }
    ]
  },
  {
    "grupo": "Bonares",
    "titulo": "Bono en dólares tasa fija 6% vto. 2029",
    "ticker": "AO29D",
    "ley": "Local",
    "vencimiento": "31/10/2029",
    "lamina": 1,
    "cashflows": [
      {
        "fecha": "2026-08-31",
        "cf": 0.73,
        "amort": 0
      },
      {
        "fecha": "2026-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-11-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2026-12-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-01-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2027-02-26",
        "cf": 0.45,
        "amort": 0
      },
      {
        "fecha": "2027-03-31",
        "cf": 0.58,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-05-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-06-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-07-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-09-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2027-10-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2027-11-30",
        "cf": 0.52,
        "amort": 0
      },
      {
        "fecha": "2027-12-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-01-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-02-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2028-03-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-04-28",
        "cf": 0.47,
        "amort": 0
      },
      {
        "fecha": "2028-05-31",
        "cf": 0.55,
        "amort": 0
      },
      {
        "fecha": "2028-06-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-07-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-09-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2028-10-31",
        "cf": 0.53,
        "amort": 0
      },
      {
        "fecha": "2028-11-30",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2028-12-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2029-01-31",
        "cf": 0.53,
        "amort": 0
      },
      {
        "fecha": "2029-02-28",
        "cf": 0.47,
        "amort": 0
      },
      {
        "fecha": "2029-03-28",
        "cf": 0.47,
        "amort": 0
      },
      {
        "fecha": "2029-04-30",
        "cf": 0.53,
        "amort": 0
      },
      {
        "fecha": "2029-05-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2029-06-29",
        "cf": 0.48,
        "amort": 0
      },
      {
        "fecha": "2029-07-31",
        "cf": 0.53,
        "amort": 0
      },
      {
        "fecha": "2029-08-31",
        "cf": 0.5,
        "amort": 0
      },
      {
        "fecha": "2029-09-28",
        "cf": 0.47,
        "amort": 0
      },
      {
        "fecha": "2029-10-31",
        "cf": 100.55,
        "amort": 100
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AN29D",
    "titulo": "Bono Tesoro 2029 u$s (AN29D)",
    "ley": "Local",
    "vencimiento": "30/11/2029",
    "cashflows": [
      {
        "fecha": "2026-05-30",
        "cf": 3.03,
        "amort": 0
      },
      {
        "fecha": "2026-11-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2027-05-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2027-11-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2028-05-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2028-11-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2029-05-30",
        "cf": 3.25,
        "amort": 0
      },
      {
        "fecha": "2029-11-30",
        "cf": 103.25,
        "amort": 100
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AL30D",
    "titulo": "Bono AL 2030 u$s Local (AL30D)",
    "ley": "Local",
    "vencimiento": "09/07/2030",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 8.27,
        "amort": 8
      },
      {
        "fecha": "2027-01-09",
        "cf": 8.24,
        "amort": 8
      },
      {
        "fecha": "2027-07-09",
        "cf": 8.21,
        "amort": 8
      },
      {
        "fecha": "2028-01-09",
        "cf": 8.42,
        "amort": 8
      },
      {
        "fecha": "2028-07-09",
        "cf": 8.35,
        "amort": 8
      },
      {
        "fecha": "2029-01-09",
        "cf": 8.28,
        "amort": 8
      },
      {
        "fecha": "2029-07-09",
        "cf": 8.21,
        "amort": 8
      },
      {
        "fecha": "2030-01-09",
        "cf": 8.14,
        "amort": 8
      },
      {
        "fecha": "2030-07-09",
        "cf": 8.07,
        "amort": 8
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AL35D",
    "titulo": "Bono AL 2035 u$s Local (AL35D)",
    "ley": "Local",
    "vencimiento": "09/07/2035",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2027-07-09",
        "cf": 2.06,
        "amort": 0
      },
      {
        "fecha": "2028-01-09",
        "cf": 2.37,
        "amort": 0
      },
      {
        "fecha": "2028-07-09",
        "cf": 2.37,
        "amort": 0
      },
      {
        "fecha": "2029-01-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2029-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2030-01-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2030-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2031-01-09",
        "cf": 12.5,
        "amort": 10
      },
      {
        "fecha": "2031-07-09",
        "cf": 12.25,
        "amort": 10
      },
      {
        "fecha": "2032-01-09",
        "cf": 12.2,
        "amort": 10
      },
      {
        "fecha": "2032-07-09",
        "cf": 11.75,
        "amort": 10
      },
      {
        "fecha": "2033-01-09",
        "cf": 11.5,
        "amort": 10
      },
      {
        "fecha": "2033-07-09",
        "cf": 11.25,
        "amort": 10
      },
      {
        "fecha": "2034-01-09",
        "cf": 11.2,
        "amort": 10
      },
      {
        "fecha": "2034-07-09",
        "cf": 10.75,
        "amort": 10
      },
      {
        "fecha": "2035-01-09",
        "cf": 10.5,
        "amort": 10
      },
      {
        "fecha": "2035-07-09",
        "cf": 10.25,
        "amort": 10
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AE38D",
    "titulo": "Bono AE 2038 u$s Local (AE38D)",
    "ley": "Local",
    "vencimiento": "09/01/2038",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 2.5,
        "amort": 4.5
      },
      {
        "fecha": "2027-07-09",
        "cf": 7.05,
        "amort": 4.5
      },
      {
        "fecha": "2028-01-09",
        "cf": 6.94,
        "amort": 4.55
      },
      {
        "fecha": "2028-07-09",
        "cf": 6.82,
        "amort": 4.55
      },
      {
        "fecha": "2029-01-09",
        "cf": 6.71,
        "amort": 4.55
      },
      {
        "fecha": "2029-07-09",
        "cf": 6.6,
        "amort": 4.55
      },
      {
        "fecha": "2030-01-09",
        "cf": 6.48,
        "amort": 4.55
      },
      {
        "fecha": "2030-07-09",
        "cf": 6.37,
        "amort": 4.55
      },
      {
        "fecha": "2031-01-09",
        "cf": 6.25,
        "amort": 4.55
      },
      {
        "fecha": "2031-07-09",
        "cf": 6.14,
        "amort": 4.55
      },
      {
        "fecha": "2032-01-09",
        "cf": 6.03,
        "amort": 4.55
      },
      {
        "fecha": "2032-07-09",
        "cf": 5.91,
        "amort": 4.55
      },
      {
        "fecha": "2033-01-09",
        "cf": 5.8,
        "amort": 4.55
      },
      {
        "fecha": "2033-07-09",
        "cf": 5.69,
        "amort": 4.55
      },
      {
        "fecha": "2034-01-09",
        "cf": 5.57,
        "amort": 4.55
      },
      {
        "fecha": "2034-07-09",
        "cf": 5.46,
        "amort": 4.55
      },
      {
        "fecha": "2035-01-09",
        "cf": 5.35,
        "amort": 4.55
      },
      {
        "fecha": "2035-07-09",
        "cf": 5.23,
        "amort": 4.55
      },
      {
        "fecha": "2036-01-09",
        "cf": 5.12,
        "amort": 4.55
      },
      {
        "fecha": "2036-07-09",
        "cf": 5,
        "amort": 4.55
      },
      {
        "fecha": "2037-01-09",
        "cf": 4.89,
        "amort": 4.55
      },
      {
        "fecha": "2037-07-09",
        "cf": 4.78,
        "amort": 4.55
      }
    ]
  },
  {
    "grupo": "Bonares",
    "ticker": "AL41D",
    "titulo": "Bono AL 2041 u$s Local (AL41D)",
    "ley": "Local",
    "vencimiento": "09/07/2041",
    "cashflows": [
      {
        "fecha": "2026-07-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2027-01-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2027-07-09",
        "cf": 1.75,
        "amort": 0
      },
      {
        "fecha": "2028-01-09",
        "cf": 5.32,
        "amort": 3.57
      },
      {
        "fecha": "2028-07-09",
        "cf": 5.25,
        "amort": 3.57
      },
      {
        "fecha": "2029-01-09",
        "cf": 5.19,
        "amort": 3.57
      },
      {
        "fecha": "2029-07-09",
        "cf": 5.13,
        "amort": 3.57
      },
      {
        "fecha": "2030-01-09",
        "cf": 5.65,
        "amort": 3.57
      },
      {
        "fecha": "2030-07-09",
        "cf": 5.77,
        "amort": 3.57
      },
      {
        "fecha": "2031-01-09",
        "cf": 5.48,
        "amort": 3.57
      },
      {
        "fecha": "2031-07-09",
        "cf": 5.39,
        "amort": 3.57
      },
      {
        "fecha": "2032-01-09",
        "cf": 5.31,
        "amort": 3.57
      },
      {
        "fecha": "2032-07-09",
        "cf": 5.22,
        "amort": 3.57
      },
      {
        "fecha": "2033-01-09",
        "cf": 5.13,
        "amort": 3.57
      },
      {
        "fecha": "2033-07-09",
        "cf": 5.04,
        "amort": 3.57
      },
      {
        "fecha": "2034-01-09",
        "cf": 4.96,
        "amort": 3.57
      },
      {
        "fecha": "2034-07-09",
        "cf": 4.87,
        "amort": 3.57
      },
      {
        "fecha": "2035-01-09",
        "cf": 4.78,
        "amort": 3.57
      },
      {
        "fecha": "2035-07-09",
        "cf": 4.7,
        "amort": 3.57
      },
      {
        "fecha": "2036-01-09",
        "cf": 4.61,
        "amort": 3.57
      },
      {
        "fecha": "2036-07-09",
        "cf": 4.52,
        "amort": 3.57
      },
      {
        "fecha": "2037-01-09",
        "cf": 4.44,
        "amort": 3.57
      },
      {
        "fecha": "2037-07-09",
        "cf": 4.35,
        "amort": 3.57
      },
      {
        "fecha": "2038-01-09",
        "cf": 4.26,
        "amort": 3.57
      },
      {
        "fecha": "2038-07-09",
        "cf": 4.17,
        "amort": 3.57
      },
      {
        "fecha": "2039-01-09",
        "cf": 4.09,
        "amort": 3.57
      },
      {
        "fecha": "2040-07-09",
        "cf": 3.83,
        "amort": 3.57
      },
      {
        "fecha": "2041-01-09",
        "cf": 3.74,
        "amort": 3.57
      },
      {
        "fecha": "2041-07-09",
        "cf": 3.69,
        "amort": 3.57
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPA7D",
    "titulo": "BOPREAL Serie 1-A",
    "ley": "Local",
    "vencimiento": "31/10/2027",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 52.5,
        "amort": 50
      },
      {
        "fecha": "2027-10-31",
        "cf": 51.25,
        "amort": 50
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPB7D",
    "titulo": "BOPREAL Serie 1-B",
    "ley": "Local",
    "vencimiento": "31/10/2027",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 52.5,
        "amort": 50
      },
      {
        "fecha": "2027-10-31",
        "cf": 51.25,
        "amort": 50
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPC7D",
    "titulo": "BOPREAL Serie 1-C",
    "ley": "Local",
    "vencimiento": "31/10/2027",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 52.5,
        "amort": 50
      },
      {
        "fecha": "2027-10-31",
        "cf": 51.25,
        "amort": 50
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPD7D",
    "titulo": "BOPREAL Serie 1-D",
    "ley": "Local",
    "vencimiento": "31/10/2027",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 2.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 52.5,
        "amort": 50
      },
      {
        "fecha": "2027-10-31",
        "cf": 51.25,
        "amort": 50
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPA8D",
    "titulo": "BOPREAL Serie 4-A",
    "ley": "Local",
    "vencimiento": "31/10/2028",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2027-10-31",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2028-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2028-10-31",
        "cf": 101.5,
        "amort": 100
      }
    ]
  },
  {
    "grupo": "Bopreales",
    "ticker": "BPB8D",
    "titulo": "BOPREAL Serie 4-B",
    "ley": "Local",
    "vencimiento": "31/10/2028",
    "cashflows": [
      {
        "fecha": "2026-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2026-10-31",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2027-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2027-10-31",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2028-04-30",
        "cf": 1.5,
        "amort": 0
      },
      {
        "fecha": "2028-10-31",
        "cf": 101.5,
        "amort": 100
      }
    ]
  }
];
