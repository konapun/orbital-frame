import listen from '../listen'

const setup = (overrides = {}) => {
  const configService = {
    ps1: '@',
    name: 'name',
    ...overrides
  }
  const listenerService = {
    listen: jest.fn(() => ({
      pipe: fn => fn('context')
    }))
  }
  const next = jest.fn()
  const args = { arg: 'passthrough' }

  return { configService, listenerService, next, args }
}

describe('listen phase', () => {
  it('should use the listener service to listen for the name provided by the config service', () => {
    const { configService, listenerService, next, args } = setup()
    listen({ configService, listenerService })(next)(args)

    expect(listenerService.listen).toHaveBeenCalledWith(/^@name\s/)
    expect(next).toHaveBeenCalledWith({ arg: 'passthrough', context: 'context', state: { get: expect.any(Function), set: expect.any(Function) } })
  })

  it('should not interpret the configured name as as regular expression', () => {
    const { configService, listenerService, next, args } = setup({ name: '^hey$' })
    listen({ configService, listenerService })(next)(args)

    expect(listenerService.listen).toHaveBeenCalledWith(/^@\^hey\$\s/)
    expect(next).toHaveBeenCalledWith({ arg: 'passthrough', context: 'context', state: { get: expect.any(Function), set: expect.any(Function) } })
  })
})
