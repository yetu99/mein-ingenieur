import { describe, it, expect } from 'vitest'
import { q, type CalculationResult, type CalculationFn } from './calculation'

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
