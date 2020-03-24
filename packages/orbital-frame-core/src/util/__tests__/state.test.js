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
    const setInitial = s.set('test2', 'yaya', { readonly: true })
    const setOverwrite = s.set('test2', 'yoyo')
    const value = s.get('test2')

    expect(setInitial).toBeTrue()
    expect(setOverwrite).toBeFalse()
    expect(value).toBe('yaya')
  })

  describe('scoping', () => {
    it('should place state in the global scope if no scope is provided', () => {
      s.set('default', 'yep')

      expect(s.get('default', { scope: 'global' })).toBe('yep')
    })

    it('should allow setting and getting a scoped value', () => {
      const setScoped = s.set('scoped', 'yep', { scope: 'scoped' })

      expect(setScoped).toBeTrue()
      expect(s.get('scoped', { scope: 'scoped' })).toBe('yep')
    })

    it('should allow a scoped key to exist independently of a global key', () => {
      const setGlobal = s.set('independent', 'global', { readonly: true })
      const setLocal = s.set('independent', 'local', { scope: 'scoped', readonly: true })

      expect(setGlobal).toBeTrue()
      expect(setLocal).toBeTrue()
      expect(s.get('independent')).toBe('global')
      expect(s.get('independent', { scope: 'scoped' })).toBe('local')
    })

    it('should retrieve the global value for the key if it was not contained within the requested scope', () => {
      s.set('onlyInGlobal', 'global value')

      expect(s.get('onlyInGlobal', { scope: 'my-scope' })).toBe('global value')
    })
  })
})
