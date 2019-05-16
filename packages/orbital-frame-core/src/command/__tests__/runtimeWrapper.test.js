import commandWrapper from '../runtimeWrapper'

describe('command runtime wrapper', () => {
  it('should create short and long keys for options', async () => {
    const command = {
      name: 'test',
      options: {
        a: {
          alias: 'option1',
          type: 'string',
          valid: () => true
        },
        b: {
          alias: 'option2',
          type: 'string',
          valid: () => true
        }
      },
      execute: jest.fn()
    }

    const wrapper = commandWrapper(1, command)
    await wrapper.execute([], {
      a: 'value1',
      option2: 'value2'
    })

    expect(command.execute).toHaveBeenCalledWith([], {
      a: 'value1',
      option1: 'value1',
      b: 'value2',
      option2: 'value2'
    })
  })

  it('should promote option values for boolean options to arguments', async () => {
    const command = {
      name: 'test',
      options: {
        s: {
          alias: 'string',
          type: 'string',
          valid: () => true

        },
        b: {
          alias: 'boolean',
          type: 'boolean',
          valid: () => true
        }
      },
      execute: jest.fn()
    }

    const wrapper = commandWrapper(1, command)
    await wrapper.execute([ 'test' ], {
      b: 'argument',
      s: 'string'
    })

    expect(command.execute).toHaveBeenCalledWith([ 'argument', 'test' ], {
      b: true,
      boolean: true,
      s: 'string',
      string: 'string'
    })

    await wrapper.execute([ 'test' ], {
      boolean: 'argument',
      s: 'string'
    })

    expect(command.execute).toHaveBeenCalledWith([ 'argument', 'test' ], {
      b: true,
      boolean: true,
      s: 'string',
      string: 'string'
    })
  })

  it('should give a true/false value to boolean options depending on if they are provided', async () => {
    const command = {
      name: 'test',
      options: {
        b: {
          alias: 'boolean',
          type: 'boolean',
          valid: () => true
        }
      },
      execute: jest.fn()
    }

    const wrapper = commandWrapper(1, command)

    console.log('---- NO BOOLEAN ----')
    await wrapper.execute([], {})
    expect(command.execute).toHaveBeenCalledWith([], { b: false, boolean: false })

    console.log('---- YES BOOLEAN ----')
    await wrapper.execute([], { boolean: undefined })
    expect(command.execute).toHaveBeenCalledWith([], { b: true, boolean: true })
  })
})
