import interpreter from '../interpreter'

describe('orbital-frame interpreter', () => {
  it('does the needful', () => {
    const result = interpreter('test')
    expect(result).toBe('test')
  })
})
