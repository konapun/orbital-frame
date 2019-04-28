const context = {
  environment: { get: jest.fn(), set: jest.fn() },
  commandRegistry: {
    test: jest.fn()
  },
  pid: 9
}

let commandBuilder, optionBuilder, commandWrapper
beforeEach(() => {
  jest.mock('../optionBuilder', () => jest.fn())
  jest.mock('../../wrapper', () => jest.fn())

  commandWrapper = require('../../wrapper')
  optionBuilder = require('../optionBuilder')
  commandBuilder = require('../commandBuilder').default

})
describe('command builder', () => {
  it('should return the command name', () => {
    const builder = commandBuilder('test', context)
    expect(builder.name).toBe('test')
  })

  it('should support adding options', () => {
    optionBuilder.mockReturnValue('option')

    const builder = commandBuilder('test', context)
    const optionChain = builder.addOption('opt')

    expect(optionBuilder).toHaveBeenCalledWith('opt', context)
    expect(optionChain).toEqual('option')
  })

  it('should support adding arguments', () => {
    const builder = commandBuilder('test', context)
    expect(builder.addArgument).toBeDefined()
    expect(builder.addArgument('arg')).toBe(builder)
  })

  it('should handle adding variables as arguments', () => {
    const builder = commandBuilder('test', context)
    expect(builder.addVariable).toBeDefined()
    expect(builder.addVariable('arg')).toBe(builder)
  })

  describe('build metadata', () => {
    it('should build metadata with plain arguments', () => {
      optionBuilder.mockReturnValue({ getMetadata: jest.fn(() => ({ o: 'option' })) })

      const builder = commandBuilder('test', context)
      builder.addOption('option')
      builder.addArgument('argument')
      const metadata = builder.getMetadata()

      expect(metadata).toEqual({ command: { name: 'test', arguments: [ 'argument' ], options: { o: 'option' } } })
    })

    it('should build metadata with complex arguments', () => {
      optionBuilder.mockReturnValue({ getMetadata: jest.fn(() => ({ o: 'option' })) })

      const builder = commandBuilder('test', context)
      builder.addOption('option')
      builder.addArgument({ getMetadata: () => 'complex' })
      const metadata = builder.getMetadata()

      expect(metadata).toEqual({ command: { name: 'test', arguments: [ 'complex' ], options: { o: 'option' } } })
    })
  })

  describe('build', () => {
    it('should throw an error if no command is registered with name', () => {
      const builder = commandBuilder('unregistered', context)
      let errorMessage
      try {
        builder.build()
      } catch ({ message }) {
        errorMessage = message
      }

      expect(errorMessage).toBe('Command not found: unregistered')

    })

    it('should produce a function on build', async () => {
      const wrapFn = jest.fn()
      const buildOption = jest.fn(() => [ 'key', 'value' ])
      commandWrapper.mockReturnValue({ execute: wrapFn })
      optionBuilder.mockReturnValue({ build: buildOption })

      const builder = commandBuilder('test', context)
      builder.addArgument('argument')
      builder.addOption('option')

      const executable = builder.build({ buildOpt: 'test' })
      expect(commandWrapper).toHaveBeenCalledWith(9, context.commandRegistry.test)
      await executable()
      expect(wrapFn).toHaveBeenCalledWith([ 'argument' ], { key: 'value' })
      expect(buildOption).toHaveBeenCalledWith({ buildOpt: 'test' })
    })

    it('should work with incoming arguments and options', async () => { // TODO: wrap these exec tests in a separate describe
      const wrapFn = jest.fn()
      commandWrapper.mockReturnValue({ execute: wrapFn })

      const builder = commandBuilder('test', context)
      builder.addArgument('own')

      const executable = builder.build()
      expect(commandWrapper).toHaveBeenCalledWith(9, context.commandRegistry.test)
      await executable([ 'incoming' ], { key: 'value' })
      expect(wrapFn).toHaveBeenCalledWith([ 'own', 'incoming' ], { key: 'value' })
    })

    it('should work with interpolated args and opts', async () => {
      const wrapFn = jest.fn()
      const argFn = jest.fn(() => 'argument')
      const optFn = jest.fn(() => 'value')
      const buildOption = jest.fn(() => [ 'key', optFn ])
      commandWrapper.mockReturnValue({ execute: wrapFn })
      optionBuilder.mockReturnValue({ build: buildOption })

      const builder = commandBuilder('test', context)
      builder.addArgument(argFn)
      builder.addOption('key')

      const executable = builder.build({ buildOpt: 'test' })
      expect(commandWrapper).toHaveBeenCalledWith(9, context.commandRegistry.test)
      await executable()
      expect(wrapFn).toHaveBeenCalledWith([ 'argument' ], { key: 'value' })
      expect(buildOption).toHaveBeenCalledWith({ buildOpt: 'test' })
    })
  })
})
