import messengerService from '../messenger'

const frame = {
  send: jest.fn()
}

const context = {
  send: jest.fn()
}

describe('messenger service', () => {
  const messenger = messengerService(frame)()

  it('should use the underlying adapter for sending messages', () => {
    messenger.send('channel', 'hello')
    expect(frame.send).toHaveBeenCalledWith('channel', 'hello')
  })

  it('should use context for responding', () => {
    messenger.respond(context, 'hello')
    expect(context.send).toHaveBeenCalledWith('hello')
  })
})
