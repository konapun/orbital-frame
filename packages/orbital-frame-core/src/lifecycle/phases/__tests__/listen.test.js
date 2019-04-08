import listen from '../listen'

const configService = { name: 'name' }
const listenerService = {
  listen: jest.fn(() => ({
    pipe: fn => fn('context')
  }))
}
const next = jest.fn()

describe('listen phase', () => {
  it('should use the listener service to listen for the name provided by the config service', () => {
    listen({ configService, listenerService })(next)()

    expect(listenerService.listen).toHaveBeenCalledWith('name')
    expect(next).toHaveBeenCalledWith({ context: 'context', state: { get: expect.any(Function), set: expect.any(Function) } })
  })
})
