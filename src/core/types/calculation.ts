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

export type Verdict = 'ok' | 'warn' | 'fail'

/**
 * Ein einzelner Nachweis (z.B. Biegung, Schub, Knicken).
 *
 * Ein Rechenmodul fuehrt mehrere unabhaengige Nachweise. Jeder hat seinen
 * eigenen Rechenweg, seine eigene Auslastung und ein eigenes Urteil.
 */
export interface Verification {
  /** Interner Bezeichner, Englisch, z.B. "bending" */
  name: string
  /** Anzeigetext, Deutsch, z.B. "Biegung" */
  label: string
  /** Massgebendes Formelzeichen, z.B. "sigma_b" */
  symbol: string
  /**
   * Auslastung mit getrennten Werten: die UI braucht vorhanden UND
   * zulaessig einzeln fuer die Balkenanzeige, nicht nur das Verhaeltnis.
   */
  utilization: {
    /** Vorhandener Wert */
    actual: number
    /** Zulaessiger Wert */
    allowed: number
    /** actual / allowed */
    ratio: number
  }
  verdict: Verdict
  /** Rechenweg DIESES einzelnen Nachweises, siehe Kommentar an CalculationResult.steps */
  steps: CalcStep[]
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
  /**
   * Rechenweg des Moduls als Ganzes, fuer Module mit einem einzelnen
   * Rechenweg ohne Nachweischarakter (z.B. reine Kennwertberechnung).
   *
   * Keine Redundanz zu Verification.steps: dort steht der Rechenweg EINES
   * einzelnen Nachweises (nur Biegung, nur Schub). Module mit Nachweisebene
   * verteilen ihre Schritte auf verifications und koennen steps fuer
   * gemeinsame Vorarbeit (Querschnittswerte, Schnittgroessen) nutzen.
   */
  steps: CalcStep[]
  /**
   * Nachweisebene. Optional: Module ohne Nachweischarakter lassen das Feld
   * weg und bleiben unveraendert lauffaehig.
   *
   * Bewusst KEIN aggregiertes Gesamturteil im Contract: overallVerdict wird
   * spaeter in src/features/ aus verifications abgeleitet, schlechtestes
   * Verdict gewinnt. Die konkrete Mapping-Logik ist noch offen.
   */
  verifications?: Verification[]
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

/**
 * Bildet einen Sicherheitsbeiwert (zulaessig / vorhanden) auf Auslastung
 * und Verdict ab. Norm-neutral: requiredSafety und warnBand kommen vom
 * aufrufenden Rechenmodul. src/core/types/ kennt keine Normwerte.
 *
 * - fail: safety < requiredSafety
 * - warn: safety >= requiredSafety, aber ohne sicheren Abstand,
 *         d.h. safety < requiredSafety * (1 + warnBand)
 * - ok:   safety >= requiredSafety * (1 + warnBand)
 *
 * Grenzfall safety === requiredSafety: bewusst 'warn', nicht 'ok'.
 * Die Mindestsicherheit ist erreicht, aber ohne jeden Abstand.
 *
 * safety <= 0 oder NaN: ratio = Infinity, verdict 'fail'. Kein NaN, kein Wurf.
 * safety = Infinity (Nachweis ohne Last, vorhanden = 0): ratio = 0, verdict 'ok'.
 *
 * @param safety Sicherheitsbeiwert = zulaessig / vorhanden
 * @param requiredSafety Mindestsicherheit laut Norm, liefert das Modul
 * @param warnBand Toleranzband ueber requiredSafety, ab dem 'ok' gilt.
 *                 0.2 bedeutet: ok erst ab 20 % Abstand ueber der Mindestsicherheit.
 */
export function verdictFromSafety(
  safety: number,
  requiredSafety: number,
  warnBand: number = 0.2,
): { ratio: number; verdict: Verdict } {
  if (Number.isNaN(safety) || safety <= 0) {
    return { ratio: Infinity, verdict: 'fail' }
  }
  if (safety === Infinity) {
    return { ratio: 0, verdict: 'ok' }
  }
  const ratio = 1 / safety
  const verdict: Verdict =
    safety < requiredSafety ? 'fail' : safety < requiredSafety * (1 + warnBand) ? 'warn' : 'ok'
  return { ratio, verdict }
}
