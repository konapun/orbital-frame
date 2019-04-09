import process from '../process'

const compilerService = { compileWithMetadata: jest.fn(() => ({ command: 'command', metadata: 'metadata' })) }
const next = jest.fn()
const args = {
  arg1: 'arg1',
  context: {
    message: {
      text: '@heavyarms mount vulcan-gun'
    }
  },
  arg3: 'arg3'
}

describe('process phase', () => {
  it('should find a message via context and compile it with the compiler service', () => {
    process({ compilerService })(next)(args)

    expect(compilerService.compileWithMetadata).toHaveBeenCalledWith('mount vulcan-gun')
    expect(next).toHaveBeenCalledWith({ ...args, command: 'command', metadata: 'metadata' })
  })
})
