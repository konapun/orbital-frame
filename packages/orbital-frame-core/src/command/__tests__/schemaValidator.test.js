import schemaValidator from '../schemaValidator'

const buildCommand = overrides => ({
  name: 'name',
  description: 'description',
  execute: jest.fn(),
  ...overrides
})

describe('command schema validator', () => {
  it('should require a name', () => {
    const command = buildCommand({ name: undefined })
    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"name" is required')
  })

  it('should not require a description', () => {
    const command = buildCommand({ description: undefined })
    const { value, error } = schemaValidator.validate(command)

    expect(error).toBe(undefined)
    expect(value).toEqual(expect.objectContaining({ description: '' }))
  })

  it('should require an execute function', () => {
    const command = buildCommand({ execute: undefined })
    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"execute" is required')
  })

  it('should provide a default for usage', () => {
    const command = buildCommand()
    const { value } = schemaValidator.validate(command)

    expect(value.usage).toBe('')
  })

  it('should provide a default for options', () => {
    const command = buildCommand()
    const { value } = schemaValidator.validate(command)

    expect(value.options).toEqual({})
  })

  it('should provide a default for format', () => {
    const command = buildCommand()
    const { value } = schemaValidator.validate(command)

    expect(value.format).toBeInstanceOf(Function)
  })

  it('should require an alias for an option', () => {
    const command = buildCommand({
      options: {
        t: {
          description: 'test',
          type: 'boolean'
        }
      }
    })

    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"options.t.alias" is required')
  })

  it('should require option non-aliases be single letters', () => {
    const command = buildCommand({
      options: {
        test: {
          alias: 't',
          description: 'test',
          type: 'boolean'
        }
      }
    })

    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"options.test" is not allowed')
  })

  it('should require option descriptions', () => {
    const command = buildCommand({
      options: {
        t: {
          alias: 'test',
          type: 'boolean'
        }
      }
    })

    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"options.t.description" is required')
  })

  it('should require a type for options', () => {
    const command = buildCommand({
      options: {
        t: {
          alias: 'test',
          description: 'test'
        }
      }
    })

    const { error } = schemaValidator.validate(command)

    expect(error.message).toBe('"options.t.type" is required')
  })

  it('should provide a default for option "required"', () => {
    const command = buildCommand({
      options: {
        t: {
          alias: 'test',
          description: 'test',
          type: 'boolean'
        }
      }
    })

    const { value } = schemaValidator.validate(command)

    expect(value.options.t.required).toBe(false)
  })

  it('should provide a default validator for options', () => {
    const command = buildCommand({
      options: {
        t: {
          alias: 'test',
          description: 'test',
          type: 'boolean'
        }
      }
    })

    const { value } = schemaValidator.validate(command)
    expect(value.options.t.valid).toBeInstanceOf(Function)
  })
})
