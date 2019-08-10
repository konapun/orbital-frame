import state from '../state'

describe('state', () => {
  const s = state()

  it('should allow setting and getting values', () => {
    s.set('test1', 'yay')
    const value = s.get('test1')

    expect(value).toEqual('yay')
  })

  it('should allow overwriting keys', () => {
    const setInitial = s.set('test2', 'yaya')
    const setOverwrite = s.set('test2', 'yoyo')
    const value = s.get('test2')

    expect(setInitial).toBeTrue()
    expect(setOverwrite).toBeTrue()
    expect(value).toEqual('yoyo')
  })

  it('should work with fuzzy types', () => {
    const setZero = s.set(0, 'zero')
    const setOne = s.set('1', 'one')
    const zero = s.get('0')
    const one = s.get(1)

    expect(setZero).toBeTrue()
    expect(setOne).toBeTrue()
    expect(zero).toEqual('zero')
    expect(one).toEqual('one')
  })

  it('should return undefined for a get with unknown keys', () => {
    const value = s.get('fake')

    expect(value).toBeUndefined()
  })

  it('should not allow a readonly value to be changed', () => {
    const setInitial = s.set('test2', 'yaya', true)
    const setOverwrite = s.set('test2', 'yoyo')
    const value = s.get('test2')

    expect(setInitial).toBeTrue()
    expect(setOverwrite).toBeFalse()
    expect(value).toBe('yaya')
  })


})
