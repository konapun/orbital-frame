const prompt = '>'

/**
 * Service for backgrounding for interactive commands
 */
const interaction = () => ({ jobService, listenerService, messengerService }) => ({
  async createInteractionChannel (commandId) {
    const { context, userId } = await jobService.findOne({ 'command.pid': commandId })
    const channelListener = listenerService.listen(`^${prompt}`) // TODO: prevent multiple interactions to be run for the same user

    return {
      async prompt (string) {
        return new Promise(resolve => {
          messengerService.respond(context, string)
          let stream
          stream = channelListener.pipe(({ message }) => {
            const { user, text } = message
            if (user.id === userId) {
              stream.detach()
              resolve(text.substring(prompt.length))
            }
          })
        })
      },

      send (message) {
        messengerService.respond(context, message)
      }
    }
  }
})

export default interaction
