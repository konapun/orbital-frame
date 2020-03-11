import configService from '../config'

describe('config service', () => {
  const frame = {
    name: 'name',
    ps1: '@',
    ps2: '>',
    commands: [ jest.fn() ],
    plugins: [ jest.fn() ],
    adapter: 'adapter'
  }

  const config = configService(frame)()

  it('should expose the bot name', () => {
    expect(config.name).toBe('name')
  })

  it('should expose the configured ps1', () => {
    expect(config.ps1).toBe('@')
  })

  it('should expose the configured ps2', () => {
    expect(config.ps2).toBe('>')
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
