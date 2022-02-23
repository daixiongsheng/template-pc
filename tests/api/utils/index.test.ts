import { random } from '../../../src/api/utils'

describe('test utils', () => {
  it('test random', () => {
    expect(random()).toBeGreaterThanOrEqual(0)
    expect(random()).toBeLessThan(100)
    expect(random(100)).toBeLessThan(100)

    expect(random(0, 1)).toBe(0)
    expect(random(-1, 0)).toBe(-1)
    expect(random(0, 0)).toBe(0)

    expect(random(1, 0)).toBe(0)
    expect(random(0, -1)).toBe(-1)
    expect(random(0, 0)).toBe(0)
  })
})
