import stream from '../stream'

const listener = frame => () => ({
  listen (matcher) {
    const { reader, writer } = stream()

    frame.hear(matcher, response => {
      writer.send(response)
    })

    return reader
  }
})

export default listener
