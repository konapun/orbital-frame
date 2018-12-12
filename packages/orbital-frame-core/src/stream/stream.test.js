import stream from './stream'

describe('stream', () => {
  it('should return a reader and a writer', () => {
    const {reader, writer} = stream() // TODO: will i ever need another writer for this stream?

    expect(reader).toBeDefined()
    expect(writer).toBeDefined()
  })

  it('should notify reader when writer is written to', () => {
    const {reader, writer} = stream()

    let pipedData
    reader.pipe(data => {
      pipedData = data
    })

    writer.send('data1')
    expect(pipedData).toEqual('data1')

    writer.send('data2')
    expect(pipedData).toEqual('data2')
  })

  it('should ignore stream data that doesn\'t have a pipe attached', () => {
    const {reader, writer} = stream()

    writer.send('data1')

    let pipedData = 'default'
    reader.pipe(data => {
      pipedData = data
    })

    expect(pipedData).toEqual('default')
  })

  it('should allow pipes to be strung together', async () => {
    const { reader, writer } = stream()

    let pipe1, pipe2, pipe3
    reader.pipe(data => {
      pipe1 = data
      return data * 2
    }).pipe(data => {
      pipe2 = data
      return data + 1
    }).pipe(data => {
      pipe3 = data
      return data
    })

    await writer.send(2)

    expect(pipe1).toBe(2)
    expect(pipe2).toBe(4)
    expect(pipe3).toBe(5)
  })

  it('should support asynchronous pipes', async () => {
    const { reader, writer } = stream()

    let pipe1, pipe2, pipe3, pipe4, pipe5
    reader.pipe(data => {
      pipe1 = data
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data * 2)
        }, 200)
      })
    }).pipe(data => {
      pipe2 = data
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 1)
        }, 300)
      })
    }).pipe(data => {
      pipe3 = data
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data + 1)
        }, 400)
      })
    }).pipe(data => {
      pipe4 = data
      return data + 1
    }).pipe(data => {
      pipe5 = data
      return data
    })

    await writer.send(2)

    expect(pipe1).toBe(2)
    expect(pipe2).toBe(4)
    expect(pipe3).toBe(5)
    expect(pipe4).toBe(6)
    expect(pipe5).toBe(7)
  })

  fit('should work with multisegmented pipes', async () => {
    const {reader, writer} = stream()

    let segment1Data, segment1aData, segment1bData
    const segment1 = reader.pipe(data => {
      segment1Data = data
      return data + 1
    })
    const segment1a = segment1.pipe(data => {
      segment1aData = data
      return data + 2
    })
    const segment1b = segment1.pipe(data => {
      segment1bData = data
      return data + 3
    })

    let segment2Data, segment2aData, segment2bData
    const segment2 = reader.pipe(data => {
      segment2Data = data
      return data + 1
    })
    const segment2a = segment2.pipe(data => {
      segment2aData = data
      return data + 2
    })
    const segment2b = segment2.pipe(data => {
      segment2bData = data
      return data + 3
    })

    let segment3Data, segment3aData, segment3bData
    const segment3 = reader.pipe(data => {
      segment3Data = data
      return data + 1
    })
    const segment3a = segment3.pipe(data => {
      segment3aData = data
      return data + 2
    })
    const segment3b = segment3.pipe(data => {
      segment3bData = data
      return data + 3
    })

    await writer.send(2)

    expect(segment1Data).toBe(2)
    expect(segment1aData).toBe(3)
    expect(segment1bData).toBe(5)

    expect(segment2Data).toBe(2)
    expect(segment2aData).toBe(3)
    expect(segment2bData).toBe(5)

    expect(segment3Data).toBe(2)
    expect(segment3aData).toBe(3)
    expect(segment3bData).toBe(5)
  })

  it('should allow pipes to be detached', () => {
    const { reader, writer } = stream()

    let pipeData
    const pipe = reader.pipe(data => {
      pipeData = data
    })

    writer.send('data1')
    expect(pipeData).toBe('data1')
    pipe.detach()

    writer.send('data2')
    expect(pipeData).toBe('data1')
  })

  it('should notify the reader when the writer closes', () => {
    const { reader, writer } = stream()
  })

  it('should throw an error if a closed stream is writter to', () => {

  })
})
