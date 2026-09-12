import { describe, it, expect } from 'vitest'
import {
  q,
  verdictFromSafety,
  type CalculationResult,
  type CalculationFn,
} from './calculation'

describe('q()', () => {
  it('baut eine Quantity mit Symbol, Wert und SI-Einheit', () => {
    const sigma = q('sigma_b', 12.5e6, 'Pa', 'Biegespannung')
    expect(sigma).toEqual({
      symbol: 'sigma_b',
      value: 12.5e6,
      unit: 'Pa',
      label: 'Biegespannung',
    })
  })

  it('laesst label optional', () => {
    const length = q('l', 0.5, 'm')
    expect(length.label).toBeUndefined()
  })
})

describe('CalculationResult-Contract', () => {
  // Beispielrechnung: Biegespannung sigma_b = M_b / W_y.
  // Zeigt, dass der Contract vollstaendig nutzbar ist und kompiliert.
  interface DemoInput {
    momentNm: number
    sectionModulusM3: number
  }

  const demoCalc: CalculationFn<DemoInput> = (inputs) => {
    const sigma = inputs.momentNm / inputs.sectionModulusM3
    return {
      id: 'test-0001',
      module: 'calc.demo-bending',
      title: 'Biegespannung',
      inputs: {
        M_b: q('M_b', inputs.momentNm, 'N*m', 'Biegemoment'),
        W_y: q('W_y', inputs.sectionModulusM3, 'm^3', 'Widerstandsmoment'),
      },
      outputs: {
        sigma_b: q('sigma_b', sigma, 'Pa', 'Biegespannung'),
      },
      steps: [
        {
          id: 'step-1',
          title: 'Biegespannung',
          formula: 'sigma_b = M_b / W_y',
          substitution: 'sigma_b = 100 N*m / 1e-6 m^3',
          result: q('sigma_b', sigma, 'Pa'),
          norm: { norm: 'DIN 1052', section: 'Abschnitt X', formula: 'Gl. 1' },
        },
      ],
      warnings: [],
      sources: [{ norm: 'DIN 1052', section: 'Abschnitt X' }],
      timestamp: new Date().toISOString(),
    }
  }

  it('liefert einen vollstaendigen CalculationResult', () => {
    const result: CalculationResult = demoCalc({ momentNm: 100, sectionModulusM3: 1e-6 })
    expect(result.outputs.sigma_b.value).toBeCloseTo(100e6)
    expect(result.steps).toHaveLength(1)
    expect(result.steps[0].result.unit).toBe('Pa')
    // ISO-8601, kein Date-Objekt
    expect(typeof result.timestamp).toBe('string')
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp)
  })
})

describe('verdictFromSafety()', () => {
  // Referenzwerte: requiredSafety = 1.5, warnBand = 0.2
  // ok erst ab safety >= 1.5 * 1.2 = 1.8
  const required = 1.5
  const band = 0.2

  it('safety deutlich ueber requiredSafety -> ok', () => {
    const { ratio, verdict } = verdictFromSafety(3.0, required, band)
    expect(verdict).toBe('ok')
    expect(ratio).toBeCloseTo(1 / 3.0)
  })

  it('safety knapp ueber requiredSafety, im Toleranzband -> warn', () => {
    // 1.7 liegt ueber 1.5, aber unter 1.8
    const { ratio, verdict } = verdictFromSafety(1.7, required, band)
    expect(verdict).toBe('warn')
    expect(ratio).toBeCloseTo(1 / 1.7)
  })

  it('safety exakt an der ok-Grenze (requiredSafety * (1 + warnBand)) -> ok', () => {
    const { verdict } = verdictFromSafety(1.8, required, band)
    expect(verdict).toBe('ok')
  })

  it('safety exakt gleich requiredSafety -> warn (bewusst gewaehlt)', () => {
    // Grenzfall: Mindestsicherheit ist erreicht, aber ohne jeden Abstand.
    // Bewusst 'warn' statt 'ok': erst das Toleranzband schafft Sicherheit.
    // Nicht 'fail': die Norm-Anforderung ist formal erfuellt.
    const { ratio, verdict } = verdictFromSafety(1.5, required, band)
    expect(verdict).toBe('warn')
    expect(ratio).toBeCloseTo(1 / 1.5)
  })

  it('safety unter requiredSafety -> fail', () => {
    const { ratio, verdict } = verdictFromSafety(1.0, required, band)
    expect(verdict).toBe('fail')
    expect(ratio).toBeCloseTo(1.0)
  })

  it('safety 0 -> fail mit ratio Infinity, kein NaN', () => {
    const { ratio, verdict } = verdictFromSafety(0, required, band)
    expect(verdict).toBe('fail')
    expect(ratio).toBe(Infinity)
    expect(Number.isNaN(ratio)).toBe(false)
  })

  it('safety negativ -> fail mit ratio Infinity, kein NaN', () => {
    const { ratio, verdict } = verdictFromSafety(-1.0, required, band)
    expect(verdict).toBe('fail')
    expect(ratio).toBe(Infinity)
    expect(Number.isNaN(ratio)).toBe(false)
  })

  it('safety NaN -> fail, kein Crash', () => {
    expect(verdictFromSafety(Number.NaN, required, band).verdict).toBe('fail')
  })

  it('safety Infinity (Nachweis ohne Last) -> ok mit ratio 0', () => {
    const { ratio, verdict } = verdictFromSafety(Infinity, required, band)
    expect(verdict).toBe('ok')
    expect(ratio).toBe(0)
  })

  it('warnBand default 0.2 greift ohne dritten Parameter', () => {
    expect(verdictFromSafety(1.7, required).verdict).toBe('warn')
    expect(verdictFromSafety(1.8, required).verdict).toBe('ok')
  })
})
