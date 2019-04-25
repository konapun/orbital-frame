import optionBuilder from '../optionBuilder'

const context = { environment: { get: jest.fn() } }

describe('option builder', () => {
  it('should support setting a value', () => {
    const builder = optionBuilder('key', context)
    expect(builder.setValue).toBeDefined()
  })

  it('should only allow setting a value once', () => {
    const builder = optionBuilder('key', context)
    builder.setValue('one')

    let err
    try {
      builder.setValue('two')
    } catch (e) {
      err = e.message
    }

    expect(err).toBe('Options may only have a single value')
  })

  it('should provide addArgument as an alias for setValue', () => {
    const builder = optionBuilder('key', context)
    expect(builder.addArgument).toBeDefined()
  })

  it('should support adding variables as option values', () => {
    const builder = optionBuilder('key', context)
    let runtimeFn
    builder.addArgument = val => runtimeFn = val
    builder.addVariable('variable')

    runtimeFn()
    expect(context.environment.get).toHaveBeenCalledWith('variable')
  })

  it('should build metadata', () => {
    const builder = optionBuilder('key', context)
    builder.addArgument('value')

    const metadata = builder.getMetadata()
    expect(metadata).toEqual({ option: { key: 'key', value: 'value' } })
  })

  it('should build a runtime representation of options', () => {
    const builder = optionBuilder('key', context)
    builder.addArgument('value')

    const built = builder.build()
    expect(built).toEqual([ 'key', 'value' ])
  })
})
