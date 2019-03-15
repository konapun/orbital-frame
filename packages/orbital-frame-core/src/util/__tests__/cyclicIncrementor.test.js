import cyclicIncrementor from '../cyclicIncrementor'

describe('cyclicIncrementor', () => {
  it('should start at the correct value', () => {
    const incrementor = cyclicIncrementor(10)
    const value = incrementor.next()
    expect(value).toBe(10)
  })

  it('should increment by one on non-wraps', () => {
    const incrementor = cyclicIncrementor(1)
    const first = incrementor.next()
    expect(first).toBe(1)
    const second = incrementor.next()
    expect(second).toBe(2)
    const third = incrementor.next()
    expect(third).toBe(3)
  })

  it('should wrap to start after max', () => {
    const incrementor = cyclicIncrementor(3, 5)
    incrementor.next()
    incrementor.next()
    const max = incrementor.next()
    const wrapped = incrementor.next()

    expect(max).toBe(5)
    expect(wrapped).toBe(3)
  })

  it('should go back to start value on reset', () => {
    const incrementor = cyclicIncrementor()
    incrementor.next()
    incrementor.next()
    incrementor.reset()
    const start = incrementor.next()
    expect(start).toBe(0)
  })
})
