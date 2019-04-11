import builder from '../index'

const commandRegistry = {}
const environment = {}

let commandBuilder, pipelineBuilder
beforeEach(() => {
  jest.resetAllMocks()
  jest.mock('../pipelineBuilder')

  pipelineBuilder = require('../pipelineBuilder').default
  commandBuilder = builder(commandRegistry, environment)
})

describe('builder', () => {
  it('should support adding pipelines', () => {
    jest.mock('../pipelineBuilder', () => jest.fn())

    const pipeline = commandBuilder.addPipeline()
    // expect(pipelineBuilder).toHaveBeenCalledWith()

  })

  it('should support adding variables', () => {

  })

  it('should build metadata', () => {

  })

  it('should build a function', () => {

  })
})
