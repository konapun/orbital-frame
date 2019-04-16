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

  })

  it('should build metadata', () => {

  })

  it('should build a pipeline function', () => {

  })
})
