import environmentService from '../environment'

describe('environment service', () => {
  const environment = environmentService()()

  it('should allow setting and retrieving values in the environment', () => {
    environment.set('test', 'it works')
    const value = environment.get('test')

    expect(value).toBe('it works')
  })

  it('should allow overwriting set values', () => {
    const variable = 'variable'
    environment.set(variable, 'initial')
    environment.set(variable, 'overwritten')
    const value = environment.get(variable)

    expect(value).toBe('overwritten')
  })

  it('should return undefined for environment keys which have not been set', () => {
    const value = environment.get('not-set')
    expect(value).toBeUndefined()
  })
})
