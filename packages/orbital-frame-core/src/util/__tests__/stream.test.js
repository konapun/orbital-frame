import stream from '../stream'

describe('stream', () => {
  it('should return a reader and a writer', () => {
    const { reader, writer } = stream()

    expect(reader).toBeDefined()
    expect(writer).toBeDefined()
  })

  it('should notify reader when writer is written to', () => {
    const { reader, writer } = stream()

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
    const { reader, writer } = stream()

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
      return data + 1
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
      return data + 1
    })

    await writer.send(2)

    expect(pipe1).toBe(2)
    expect(pipe2).toBe(4)
    expect(pipe3).toBe(5)
    expect(pipe4).toBe(6)
    expect(pipe5).toBe(7)
  })

  it('should work with multisegmented pipes', async () => {
    const { reader, writer } = stream()

    let segment1Data, segment1aData, segment1bData
    const segment1 = reader.pipe(data => {
      segment1Data = data
      return data + 1
    })
    segment1.pipe(data => {
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
    segment2.pipe(data => {
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
    segment3.pipe(data => {
      segment3aData = data
      return data + 2
    })
    const segment3b = segment3.pipe(data => {
      segment3bData = data
      return data + 3
    })

    let segment1b1Data, segment2b1Data, segment3b1Data
    segment1b.pipe(data => {
      segment1b1Data = data
      return data
    })
    segment2b.pipe(data => {
      segment2b1Data = data
      return data
    })
    segment3b.pipe(data => {
      segment3b1Data = data
    })

    await writer.send(2)

    expect(segment1Data).toBe(2)
    expect(segment1aData).toBe(3)
    expect(segment1bData).toBe(3)

    expect(segment2Data).toBe(2)
    expect(segment2aData).toBe(3)
    expect(segment2bData).toBe(3)

    expect(segment3Data).toBe(2)
    expect(segment3aData).toBe(3)
    expect(segment3bData).toBe(3)

    expect(segment1b1Data).toBe(6)
    expect(segment2b1Data).toBe(6)
    expect(segment3b1Data).toBe(6)
  })

  it('should allow pipes to be ended', async () => {
    const { reader, writer } = stream()

    let pipeData
    const pipe1 = reader.pipe(data => {
      pipeData = `Pipe1: ${data}`
    })
    const pipe2 = reader.pipe(data => {
      pipeData = `Pipe2: ${data}`
    })

    await writer.send('data')
    expect(pipeData).toBe('Pipe2: data')

    pipe2.end()
    await writer.send('data2')
    expect(pipeData).toBe('Pipe1: data2')

    pipe1.end()
    await writer.send('data3')
    expect(pipeData).toBe('Pipe1: data2')
  })

  it('should allow piping between streams', async () => {
    // TODO: each pipe creates a duplex stream but should streams created manually be pipeable?
  })

  it('should throw an error if a closed stream is writter to', async () => {
    const { writer } = stream()

    let message
    writer.close()
    try {
      await writer.send('test')
    } catch (e) {
      message = e.message
    }

    expect(message).toBe('Attempting to write to a closed stream')
  })
})
