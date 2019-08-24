const context = {
  commandRegistry: {}
}

let pipelineBuilder, commandBuilder, interpolationBuilder
beforeEach(() => {
  jest.resetAllMocks()
    .mock('../commandBuilder')
    .mock('../interpolationBuilder')

  commandBuilder = require('../commandBuilder').default
  pipelineBuilder = require('../pipelineBuilder').default
  interpolationBuilder = require('../interpolationBuilder').default
})

describe('pipeline builder', () => {
  it('should support adding commands', () => {
    const commandChain = jest.fn()
    commandBuilder.mockReturnValue(() => commandChain)
    // const builder = pipelineBuilder(context)

    // const chain = builder.addCommand('test')
    // expect(commandBuilder).toHaveBeenCalledWith('test', context)
    // expect(chain).toBe(commandChain) // FIXME:

  })

  it('should support adding interpolations as arguments', () => {
    // const builder = pipelineBuilder(context)

    // const chain = builder.addArgument('interpolation')
    // TODO:
  })

  describe('buildMetadata', () => {
    it('should build metadata for pipelines with commands', () => {
      const getMetadata = jest.fn(() => 'commandMetadata')
      commandBuilder.mockReturnValue({ getMetadata })

      const builder = pipelineBuilder(context)

      builder.addCommand('test-command')
      expect(commandBuilder).toHaveBeenCalled()
      const metadata = builder.getMetadata()

      expect(metadata).toEqual({ pipeline: [ 'commandMetadata' ] })
    })

    it('should build metadata for pipelines with commands and interpolations', () => {
      const getCommandMetadata = jest.fn(() => 'commandMetadata')
      const getInterpolation1Metadata = jest.fn(() => 'interpolation1')
      const getInterpolation2Metadata = jest.fn(() => 'interpolation2')

      commandBuilder.mockReturnValue({ getMetadata: getCommandMetadata })
      interpolationBuilder.mockReturnValueOnce({ getMetadata: getInterpolation1Metadata })
      interpolationBuilder.mockReturnValueOnce({ getMetadata: getInterpolation2Metadata })

      const builder = pipelineBuilder(context)

      builder.addCommand('test-command')
      expect(commandBuilder).toHaveBeenCalled()
      builder.addArgument('interpolation1')
      builder.addArgument('interpolation2')
      const metadata = builder.getMetadata()

      expect(getCommandMetadata).toHaveBeenCalled()
      expect(getInterpolation1Metadata).toHaveBeenCalled()
      expect(getInterpolation2Metadata).toHaveBeenCalled()
      expect(metadata).toEqual({ pipeline: [ 'commandMetadata', 'interpolation1', 'interpolation2' ] })
    })

    it('should build metadata for pipelines with only interpolations', () => {
      const builder = pipelineBuilder(context)

      const getInterpolation1Metadata = jest.fn(() => 'interpolation1')
      const getInterpolation2Metadata = jest.fn(() => 'interpolation2')
      interpolationBuilder.mockReturnValueOnce({ getMetadata: getInterpolation1Metadata })
      interpolationBuilder.mockReturnValueOnce({ getMetadata: getInterpolation2Metadata })

      builder.addArgument('interpolation')
      builder.addArgument('interpolation2')
      const metadata = builder.getMetadata()

      expect(getInterpolation1Metadata).toHaveBeenCalled()
      expect(getInterpolation2Metadata).toHaveBeenCalled()
      expect(metadata).toEqual({ pipeline: [ 'interpolation1', 'interpolation2' ] })
    })
  })

  describe('build', () => {
    it('should allow passing arguments and options to the built pipeline function', async () => {
      const args = [ 'arg1', 'arg2' ]
      const opts = { opt1: 'opt1', opt2: 'opt2' }
      const builtExecutable = jest.fn(() => 'exec')
      const buildCommand = jest.fn(() => builtExecutable)
      commandBuilder.mockReturnValue({ build: buildCommand })

      const builder = pipelineBuilder(context)
      builder.addCommand('command')
      const fn = builder.build()
      const output = await fn(args, opts)

      expect(output).toBe('exec')
      expect(buildCommand).toHaveBeenCalledWith({})
      expect(builtExecutable).toHaveBeenCalledWith(args, opts)
    })

    it('should invoke the command formatter', async () => {
      const builtExecutable = jest.fn(() => 'exec')
      const buildCommand = jest.fn(() => builtExecutable)
      const format = jest.fn(() => 'formatted')
      context.commandRegistry.command = { format }
      commandBuilder.mockReturnValue({ name: 'command', build: buildCommand })

      const builder = pipelineBuilder(context)
      builder.addCommand('command')
      const fn = builder.build()
      const output = await fn()

      expect(output).toBe('formatted')
      expect(buildCommand).toHaveBeenCalledWith({})
      expect(builtExecutable).toHaveBeenCalled()
      expect(format).toHaveBeenCalledWith('exec')
    })

    it('should not format output if format = false is passed as a build option', async () => {
      const builtExecutable = jest.fn(() => 'exec')
      const buildCommand = jest.fn(() => builtExecutable)
      const format = jest.fn(() => 'formatted')
      context.commandRegistry.command = { format }
      commandBuilder.mockReturnValue({ name: 'command', build: buildCommand })

      const builder = pipelineBuilder(context)
      builder.addCommand('command')
      const fn = builder.build({ format: false })
      const output = await fn()

      expect(output).toBe('exec')
      expect(buildCommand).toHaveBeenCalledWith({ format: false })
      expect(builtExecutable).toHaveBeenCalled()
      expect(format).not.toHaveBeenCalled()
    })
  })
})
