import stream from '../stream'

const listener = frame => () => ({
  listen (matcher) {
    const { reader, writer } = stream()

    frame.hear(matcher, response => {
      response.send('Core send!') // TODO: remove this after testing
      writer.send(response)
    })

    return reader
  }
})

export default listener
