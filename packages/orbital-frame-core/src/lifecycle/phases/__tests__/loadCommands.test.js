import loadCommands from '../loadCommands'

const commands = [ 'test' ]
const configService = { commands }
const commandService = { load: jest.fn() }
const next = jest.fn()
const args = { arg: 'passthrough' }

describe('loadCommands phase', () => {
  it('should find commands using the config service and load them with the command service', () => {
    loadCommands({ configService, commandService })(next)(args)

    expect(commandService.load).toHaveBeenCalledWith(commands)
    expect(next).toHaveBeenCalledWith(args)
  })
})
