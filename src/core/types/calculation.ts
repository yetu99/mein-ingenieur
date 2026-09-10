/**
 * Rechenweg-Contract.
 *
 * Jedes Rechenmodul in src/core/ gibt genau diese Struktur zurueck.
 * Grund: der Rechenweg laesst sich nachtraeglich nicht ergaenzen, ohne die
 * Rechenfunktion neu zu schreiben. Deshalb steht dieser Contract vor dem
 * ersten Modul fest.
 *
 * Nicht aendern ohne Pull Request, den beide gelesen haben.
 */

/** Ein Wert mit Formelzeichen und Einheit. Einheiten immer SI. */
export interface Quantity {
  /** Formelzeichen, z.B. "sigma_b" */
  symbol: string
  value: number
  /** SI-Einheit, z.B. "Pa", "m", "N*m" */
  unit: string
  /** Klartext fuer die Oberflaeche, z.B. "Biegespannung" */
  label?: string
}

/** Verweis auf eine Normstelle. Volltext wird nie mitgeliefert. */
export interface NormReference {
  /** z.B. "VDI 2230:2015" */
  norm: string
  /** z.B. "Abschnitt 5.4" */
  section: string
  /** z.B. "Gl. 5.4/2" */
  formula?: string
}

export type Severity = 'info' | 'warning' | 'violation'

export interface CalcWarning {
  severity: Severity
  message: string
  /** Feldname der Eingabe, auf die sich die Warnung bezieht */
  field?: string
  norm?: NormReference
}

/**
 * Ein Schritt im Rechenweg. Die Summe aller Schritte ergibt den Nachweis,
 * der spaeter im PDF steht.
 */
export interface CalcStep {
  id: string
  /** Was in diesem Schritt passiert, z.B. "Biegespannung am Auflager" */
  title: string
  /** Formel symbolisch, z.B. "sigma_b = M_b / W_y" */
  formula: string
  /** Dieselbe Formel mit eingesetzten Zahlen */
  substitution?: string
  result: Quantity
  norm?: NormReference
  /** IDs von Wissenspunkten oder Kennwerten fuer Deep-Links */
  refs?: string[]
  note?: string
}

/** Rueckgabe jedes Rechenmoduls. */
export interface CalculationResult {
  /** Eindeutige ID dieser Berechnung, z.B. crypto.randomUUID() */
  id: string
  /** Modul-ID, z.B. "calc.beam-bending" */
  module: string
  title: string
  inputs: Record<string, Quantity>
  outputs: Record<string, Quantity>
  steps: CalcStep[]
  warnings: CalcWarning[]
  sources: NormReference[]
  /**
   * ISO-8601 String, nicht Date.
   * Grund: muss verlustfrei durch localStorage, JSON-Export und Supabase.
   */
  timestamp: string
}

/** Signatur jeder Rechenfunktion. */
export type CalculationFn<TInput> = (inputs: TInput) => CalculationResult

/** Kurzschreibweise beim Bauen von Schritten. */
export function q(symbol: string, value: number, unit: string, label?: string): Quantity {
  return { symbol, value, unit, label }
}
