import process from '../process'

const setup = overrides => {
  const args = {
    arg1: 'arg1',
    context: {
      message: {
        text: '@heavyarms mount vulcan-gun'
      }
    },
    arg3: 'arg3',
    ...overrides
  }
  const compilerService = { compileWithMetadata: jest.fn(() => ({ command: 'command', metadata: 'metadata' })) }
  const next = jest.fn()

  return {
    compilerService,
    next,
    args
  }
}


describe('process phase', () => {
  it('should find a message via context and compile it with the compiler service', () => {
    const { compilerService, next, args } = setup()
    process({ compilerService })(next)(args)

    expect(compilerService.compileWithMetadata).toHaveBeenCalledWith('mount vulcan-gun')
    expect(next).toHaveBeenCalledWith({ ...args, source: 'mount vulcan-gun', command: 'command', metadata: 'metadata' })
  })

  it('should not remove newlines when building the source string', () => {
    const command = `
    function mount {
      WEAPON=$1
      install $WEAPON
      set-active --weapon $WEAPON
    }`

    const { compilerService, next, args } = setup({
      context: {
        message: {
          text: `@heavyarms ${command}`
        }
      }
    })

    process({ compilerService })(next)(args)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      source: command
    }))
  })
})
