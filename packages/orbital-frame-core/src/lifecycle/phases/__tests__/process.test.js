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
  const configService = { name: overrides?.name ?? 'heavyarms'}
  const next = jest.fn()

  return {
    compilerService,
    configService,
    processStep: process({ compilerService, configService }),
    next,
    args
  }
}


describe('process phase', () => {
  it('should find a message via context and compile it with the compiler service', () => {
    const { compilerService, configService, next, args } = setup()
    process({ compilerService, configService })(next)(args)

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

    const { processStep, next, args } = setup({
      context: {
        message: {
          text: `@heavyarms ${command}`
        }
      }
    })

    processStep(next)(args)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      source: command
    }))
  })
})
