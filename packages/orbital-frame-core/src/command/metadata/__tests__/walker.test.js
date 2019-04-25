import metadataWalker from '../walker'

describe('metadata walker', () => {
  const metadata = { // metadata for `echo "1 + 2" | calc`
    program: {
      assignments: [],
      pipelines: [ {
        pipeline: [ {
          command: {
            name: 'echo',
            options: {},
            arguments: [ '1 + 2' ]
          }
        }, {
          command: {
            name: 'calc',
            options: {},
            arguments: []
          }
        } ]
      } ]
    }
  }

  it('should find all metadata matching given criteria', () => {
    const walker = metadataWalker(metadata)
    const found = walker.find(data => data.type === 'command')

    expect(found).toEqual([ { type: 'command', value: { arguments: [ '1 + 2' ], name: 'echo', options: {} } }, { type: 'command', value: { arguments: [], name: 'calc', options: {} } } ])
  })

  it('should return the first piece of metadata using findOne', () => {
    const walker = metadataWalker(metadata)
    const found = walker.findOne(data => data.type === 'command')

    expect(found).toEqual({ arguments: [ '1 + 2' ], name: 'echo', options: {} })
  })

  it('should throw an error if attempting to findOne with no results', () => {
    const walker = metadataWalker(metadata)
    expect(() => walker.findOne(data => data.type === 'fake')).toThrow()
  })
})
