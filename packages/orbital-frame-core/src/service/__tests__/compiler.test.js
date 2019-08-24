import compilerService from '../compiler'

let compiler, commandService, environmentService

const testCommand1 = {
  name: 'testCommand1',
  description: 'test command 1',
  execute: jest.fn()
}

const testCommand2 = {
  name: 'testCommand2',
  description: 'test command 2',
  execute: jest.fn()
}

beforeEach(() => {
  commandService = {
    registry: {
      testCommand1,
      testCommand2
    }
  }

  environmentService = {
    set: jest.fn(),
    get: jest.fn()
  }

  compiler = compilerService()({ commandService, environmentService })
})

describe('compiler service', () => {
  it('should work with single commands', async () => {
    const executable = compiler.compile('testCommand1')
    await executable()
    // TODO:
    // expect(testCommand1).toHaveBeenCalledWith()
    // test opts
    // test args
  })

  it('should work with pipes', () => {
    // TODO:
  })

  it('should work with variables', () => {
    // TODO:
  })

  it('should work with interpolated arguments', () => {
    // TODO:
  })

  it('should work with interpolated option values', () => {
    // TODO:
  })

  it('should work with asynchronous interpolated arguments', () => {
    // TODO:
  })

  it('should work with asynchronous interpolated option values', () => {
    // TODO:
  })

  it('should work with nested interpolations', () => {
    // TODO:
  })

  it('should work with condensed single options', () => {
    // TODO:
  })

  it('should work with asynchronous interpolations with pipes', () => {
    // TODO:
  })
})
