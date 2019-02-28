/**
 * Service for backgrounding for interactive commands
 */
const interaction = ({ jobService, listenerService, messengerService }) => () => ({
  getInteractionChannel (commandId) {
    const { context, userId } = jobService.findOne({ command: commandId }) // FIXME: this might be 'command.id': commandId which `findOne` doesn't currently understand

    return {
      async prompt (string) {
        return new Promise(resolve => {
          messengerService.respond(context, string)
          const stream = listenerService.listen()
          stream.pipe(({ message }) => {
            const { user, text } = message
            if (user.id === userId) {
              stream.detach()
              resolve(text)
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
