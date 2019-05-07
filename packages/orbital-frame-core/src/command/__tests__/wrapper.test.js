import wrapper from '../wrapper'

describe('command wrapper', () => {
  it('should cast args to an array and provide an empty object as default options', () => {
    const execute = jest.fn()
    const definition = {
      name: 'command',
      description: 'a command',
      options: {},
      execute
    }

    const command = wrapper(definition)

    command.execute('scalar')
    expect(execute).toHaveBeenCalledWith([ 'scalar' ], {})

    command.execute([ 'array' ], { option: 'option' })
    expect(execute).toHaveBeenCalledWith([ 'array' ], { option: 'option' })
  })

  it('should preserve the calling context to the wrapped command', () => {
    let executionContext
    const execute = jest.fn()
    const definition = {
      name: 'command',
      description: 'a command',
      options: {},
      execute (args, opts) {
        executionContext = this
        execute(args, opts)
      }
    }
    const context = {
      working: true
    }

    const command = wrapper(definition)
    command.execute.call(context, 'arg')

    expect(execute).toHaveBeenCalledWith([ 'arg' ], {})
    expect(executionContext).toBe(context)
  })
})
