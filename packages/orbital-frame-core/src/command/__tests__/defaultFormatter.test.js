import format from '../defaultFormatter'

describe('default formatter', () => {
  it('should join array output', () => {
    const output = [ 'this', 'should', 'be', 'joined' ]
    const formatted = format(output)

    expect(formatted).toEqual('this should be joined')
  })

  it('should format an object to a key value string', () => {
    const output = {
      key1: 'value1',
      key2: 'value2'
    }
    const formatted = format(output)

    expect(formatted).toEqual(`key1 value1
key2 value2`)
  })
})
