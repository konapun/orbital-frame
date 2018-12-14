// Uses:
// Streaming responses from slack to the client (via the listener)
// command flow (pipes, redirection channels, etc)

function stream () {
  let id = 0
  let listeners = []
  let open = true

  const detach = streamId => {
    listeners = listeners.filter(({id: listenerId}) => listenerId !== streamId)
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
        detach: detach.bind(null, ++id)
      }

      listeners.push({ id, call: onWrite })
      return continuation
    }
  }

  const writer = {
    async send (data) {
      if (!open) {
        throw new Error('Attempting to write to a closed stream')
      }
      return await Promise.all(listeners.map(listener => listener.call(data)))
    },

    async close () {
      open = false
    }
  }

  return { reader, writer }
}

export default stream
