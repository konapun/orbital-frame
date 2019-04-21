const context = {
  commandRegistry: {}
}

let pipelineBuilder, commandBuilder
beforeEach(() => {
  jest.resetAllMocks()
    .mock('../commandBuilder')

  commandBuilder = require('../commandBuilder').default
  pipelineBuilder = require('../pipelineBuilder').default
})

describe('pipeline builder', () => {
  it('should support adding commands', () => {
    const commandChain = jest.fn()
    commandBuilder.mockReturnValue(() => commandChain)
    const builder = pipelineBuilder(context)

    const chain = builder.addCommand('test')
    expect(commandBuilder).toHaveBeenCalledWith('test', context)
    expect(chain).toBe(commandChain) // FIXME:

  })

  it('should support adding interpolations as arguments', () => {
    const builder = pipelineBuilder(context)

    const chain = builder.addArgument('interpolation')

  })

  fit('should build metadata', () => {
    const getMetadata = jest.fn(() => 'commandMetadata')
    commandBuilder.mockReturnValue({ getMetadata })


    const builder = pipelineBuilder(context)

    builder.addCommand('test-command')
    expect(commandBuilder).toHaveBeenCalled()
    builder.addArgument('interpolation')
    builder.addArgument('interpolation2')
    const metadata = builder.getMetadata()

    expect(metadata).toEqual({ commands: [ 'commandMetadata' ], interpolations: [ 'interpolation' ] })
  })

  it('should build a pipeline function', () => {

  })
})
