import messengerService from '../messenger'

const frame = {
  send: jest.fn()
}

const context = {
  send: jest.fn(),
  reply: jest.fn()
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

  it('should use context for replying', () => {
    messenger.reply(context, 'hello')
    expect(context.reply).toHaveBeenCalledWith('hello')
  })
})
