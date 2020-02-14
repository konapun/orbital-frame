import listen from '../listen'

const configService = { ps1: '@', name: 'name' }
const listenerService = {
  listen: jest.fn(() => ({
    pipe: fn => fn('context')
  }))
}
const next = jest.fn()
const args = { arg: 'passthrough' }

describe('listen phase', () => {
  it('should use the listener service to listen for the name provided by the config service', () => {
    listen({ configService, listenerService })(next)(args)

    expect(listenerService.listen).toHaveBeenCalledWith(/^@name\s/)
    expect(next).toHaveBeenCalledWith({ arg: 'passthrough', context: 'context', state: { get: expect.any(Function), set: expect.any(Function) } })
  })
})
