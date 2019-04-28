import configService from '../config'

describe('config service', () => {
  const frame = {
    name: 'name',
    commands: [ jest.fn() ],
    plugins: [ jest.fn() ],
    adapter: 'adapter'
  }

  const config = configService(frame)()

  it('should expose the bot name', () => {
    expect(config.name).toBe('name')
  })

  it('should expose commands loaded into the bot', () => {
    expect(config.commands).toHaveLength(1)
  })

  it('should expose plugins loaded into the bot', () => {
    expect(config.plugins).toHaveLength(1)
  })

  it('should expose the chat service adapter the bot is running on', () => {
    expect(config.adapter).toBe('adapter')
  })
})
