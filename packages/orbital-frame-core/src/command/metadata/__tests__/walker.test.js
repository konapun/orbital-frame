import metadataWalker from '../walker'

describe('metadata walker', () => {
  const metadata = {
    assignments: [],
    pipelines: [
      {
        commands: [
          { name: 'echo', options: {}, arguments: [ 'hello' ] },
          { name: 'greet', options: {}, arguments: [] }
        ]
      }
    ]
  }

  it('should find all metadata matching given criteria', () => {
    const walker = metadataWalker(metadata)
    const found = walker.find(data => data.type === 'commands')

    expect(found).toEqual([ { type: 'commands', value: [ { arguments: [ 'hello' ], name: 'echo', options: {} }, { arguments: [], name: 'greet', options: {} } ] } ])
  })

  it('should return the first piece of metadata using findOne', () => {
    const walker = metadataWalker(metadata)
    const found = walker.findOne(data => data.type === 'commands')

    expect(found).toEqual({ arguments: [ 'hello' ], name: 'echo', options: {} })
  })

  it('should throw an error if attempting to findOne with no results', () => {
    const walker = metadataWalker(metadata)
    expect(() => walker.findOne(data => data.type === 'fake')).toThrow()
  })
})
