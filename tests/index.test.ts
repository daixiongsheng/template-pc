import { random } from '../src/api/utils'

describe('类型', () => {
  it('isPromise', () => {
    expect(random()).toBeGreaterThan(0)
    expect(random(0, 1)).toBe(0)
  })
  it('ok', () => {
    expect(200).toBe(200)
    expect(['lime', 'apple']).toContain('lime') // 判断是否在数组中
  })
})
