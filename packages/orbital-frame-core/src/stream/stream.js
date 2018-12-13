// Uses:
// Streaming responses from slack to the client (via the listener)
// command flow (pipes, redirection channels, etc)

function stream () {
  let listeners = []
  let open = true

  const detach = con => {
    listeners = listeners.filter(({continuation}) => con !== continuation)
  }

  const reader = {
    pipe (fn) {
      const { reader: segmentReader, writer: segmentWriter } = stream()

      const onWrite = async data => {
        const output = await fn(data)
        await segmentWriter.send(output) // activate downstream pipes
        return output
      }

      const continuation = {
        pipe: segmentReader.pipe,
        end: reader.end,
        detach
      }

      listeners.push({ call: onWrite, continuation })
      return continuation
    },

    end (fn) {

    }
  }

  const writer = {
    async send (data) {
      return await Promise.all(listeners.map(listener => listener.call(data)))
    },

    close () {
      open = false
    }
  }

  return { reader, writer }
}

export default stream
