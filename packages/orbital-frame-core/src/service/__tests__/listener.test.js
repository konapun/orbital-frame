import listenerService from '../listener'

let callback
const frame = {
  hear: jest.fn((matcher, cb) => {
    callback = cb
  })
}

describe('listener service', () => {
  const listener = listenerService(frame)()

  it('should use the underlying adapter to listen for incoming messages', () => {
    listener.listen('test')
    expect(frame.hear).toHaveBeenCalled()
  })

  it('should write to a stream on message received', () => {
    const reader = listener.listen('test')
    const pipefn = jest.fn()
    reader.pipe(data => pipefn(data))
    callback('done')

    expect(pipefn).toHaveBeenCalledWith('done')
  })
})
