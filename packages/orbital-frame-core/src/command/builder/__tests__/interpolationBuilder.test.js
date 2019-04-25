import interpolationBuilder from '../interpolationBuilder'

describe('interpolation builder', () => {
  it('should build metadata', () => {
    const builder = interpolationBuilder('metadata')

    const metadata = builder.getMetadata()
    expect(metadata).toEqual({ interpolation: 'metadata' })
  })

  it('should return the interpolation as the built value', () => {
    const interpolation = jest.fn(() => 'yeet')

    const builder = interpolationBuilder(interpolation)
    const fn = builder.build()
    const output = fn()

    expect(interpolation).toHaveBeenCalled()
    expect(output).toBe('yeet')
  })
})
