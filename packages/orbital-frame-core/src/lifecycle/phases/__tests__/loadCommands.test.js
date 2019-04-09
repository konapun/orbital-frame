import loadCommands from '../loadCommands'

const commands = [ 'test' ]
const configService = { commands }
const commandService = { load: jest.fn() }
const next = jest.fn()

describe('loadCommands phase', () => {
  it('should find commands using the config service and load them with the command service', () => {
    loadCommands({ configService, commandService })(next)()

    expect(commandService.load).toHaveBeenCalledWith(commands)
    expect(next).toHaveBeenCalled()
  })
})
