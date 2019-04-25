import assignmentBuilder from '../assignmentBuilder'

describe('assignment builder', () => {
  it('should support adding arguments', () => {
    const builder = assignmentBuilder('key')
    expect(builder.addArgument).toBeDefined()
  })

  it('should build metadata', () => {
    const builder = assignmentBuilder('key')
    builder.addArgument('value')

    const metadata = builder.getMetadata()
    expect(metadata).toEqual({ assignment: { variable: 'key', value: 'value' } })
  })

  it('should return a build representation', () => {
    const builder = assignmentBuilder('key')
    builder.addArgument('value')

    const metadata = builder.build()
    expect(metadata).toEqual([ 'key', 'value' ])
  })
})
