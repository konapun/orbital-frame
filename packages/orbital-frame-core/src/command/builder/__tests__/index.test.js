const commandRegistry = {}
const environment = { set: jest.fn() }

let commandBuilder, pipelineBuilder, assignmentBuilder
beforeEach(() => {
  jest.resetAllMocks()
  jest.mock('../pipelineBuilder', () => jest.fn())
  jest.mock('../assignmentBuilder', () => jest.fn())

  pipelineBuilder = require('../pipelineBuilder')
  assignmentBuilder = require('../assignmentBuilder')

  const builder = require('../index').default
  commandBuilder = builder(commandRegistry, environment)
})

describe('builder', () => {
  it('should support adding pipelines', () => {
    pipelineBuilder.mockReturnValueOnce('pipeline')
    const chain = commandBuilder.addPipeline()
    expect(pipelineBuilder).toHaveBeenCalledWith({ commandRegistry, environment, pid: 1 })
    expect(chain).toBe('pipeline')
  })

  it('should support adding variables', () => {
    assignmentBuilder.mockReturnValueOnce('assignment')
    const chain = commandBuilder.addVariable('test')
    expect(assignmentBuilder).toHaveBeenCalledWith('test')
    expect(chain).toBe('assignment')
  })

  it('should build metadata', () => {
    pipelineBuilder.mockReturnValue({ getMetadata: jest.fn(() => 'pipeline') })
    assignmentBuilder.mockReturnValue({ getMetadata: jest.fn(() => 'assignment') })

    const pipelineChain = commandBuilder.addPipeline()
    const variableChain = commandBuilder.addVariable('test')

    const metadata = commandBuilder.getMetadata()
    expect(pipelineChain.getMetadata).toHaveBeenCalled()
    expect(variableChain.getMetadata).toHaveBeenCalled()
    expect(metadata).toEqual({ assignments: [ 'assignment' ], pipelines: [ 'pipeline' ] })
  })

  it('should build a function', async () => {
    pipelineBuilder.mockReturnValue({ build: jest.fn(() => jest.fn()) })
    assignmentBuilder.mockReturnValue({ build: jest.fn(() => [ 'test', 'assignment' ]) })

    const pipelineChain = commandBuilder.addPipeline()
    const variableChain = commandBuilder.addVariable('test')

    const executable = commandBuilder.build()
    expect(executable.pid).toBe(4)

    await executable()
    expect(pipelineChain.build).toHaveBeenCalled()
    expect(variableChain.build).toHaveBeenCalled()
  })
})
