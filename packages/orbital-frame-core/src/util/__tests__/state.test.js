import state from '../state'

describe('state', () => {
  const s = state()

  it('should allow setting and getting values', () => {
    s.set('test1', 'yay')
    const value = s.get('test1')

    expect(value).toEqual('yay')
  })

  it('should allow overwriting keys', () => {
    s.set('test2', 'yaya')
    s.set('test2', 'yoyo')
    const value = s.get('test2')

    expect(value).toEqual('yoyo')
  })

  it('should work with fuzzy types', () => {
    s.set(0, 'zero')
    s.set('1', 'one')
    const zero = s.get('0')
    const one = s.get(1)

    expect(zero).toEqual('zero')
    expect(one).toEqual('one')
  })

  it('should return undefined for a get with unknown keys', () => {
    const value = s.get('fake')

    expect(value).toBeUndefined()
  })
})
