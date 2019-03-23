import compilerService from '../compiler'

let compiler, commandService, environmentService

const testCommand1 = jest.fn(() => ({
  name: 'test-command1',
  description: 'test command 1',
  execute: jest.fn()
}))

const testCommand2 = () => ({
  name: 'test-command2',
  description: 'test command 2',
  execute: jest.fn()
})

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
  it('should work with single commands', () => {
    const executable = compiler.compile('test-command1')
    executable()
    // expect(testCommand1).toHaveBeenCalledWith()
    // test opts
    // test args
  })

  it('should work with pipes', () => {

  })

  it('should work with variables', () => {

  })

  it('should work with interpolated arguments', () => {

  })

  it('should work with interpolated option values', () => {

  })

  it('should work with asynchronous interpolated arguments', () => {

  })

  it('should work with asynchronouse interpolated option values', () => {

  })

  it('should work with nested interpolations', () => {

  })

  it('should work with condensed single options', () => {

  })

  it('should work with asynchronous interpolations with pipes', () => {

  })
})
