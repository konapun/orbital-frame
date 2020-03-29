import assignmentBuilder from '../assignmentBuilder'

const context = {
  environment: {
    get: jest.fn()
  }
}

describe('assignment builder', () => {
  it('should support adding arguments', () => {
    const builder = assignmentBuilder('key', undefined, context)
    expect(builder.addArgument).toBeDefined()
  })

  it('should build metadata', () => {
    const builder = assignmentBuilder('key', undefined, context)
    builder.addArgument('value')

    const metadata = builder.getMetadata()
    expect(metadata).toEqual({ assignment: { variable: 'key', scope: undefined, value: 'value' } })
  })

  it('should return a build representation', () => {
    const builder = assignmentBuilder('key', 'global', context)
    builder.addArgument('value')

    const metadata = builder.build()
    expect(metadata).toEqual([ 'key', 'global', 'value' ])
  })
})
