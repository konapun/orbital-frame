import stream from '../util/stream'

// TODO: multiple listeners can consume the same message. Modify this so a message can only be processed by a single listener?
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
