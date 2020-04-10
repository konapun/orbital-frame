const messenger = frame => () => ({
  respond (context, message) {
    return context.send(message)
  },

  send (channel, message) {
    return frame.send(channel, message)
  }
})

export default messenger
