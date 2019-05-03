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
})
