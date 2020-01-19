/**
 * Service for backgrounding for interactive commands
 */
const interaction = () => ({ configService, jobService, listenerService, messengerService }) => {
  const prompt = configService.ps2

  return {
    async createInteractionChannel (commandId, userIds = []) {
      const { context, userId } = await jobService.findOne({ 'command.pid': commandId })
      const members = [ userId, ...userIds ]
      const channelListener = listenerService.listen(`^${prompt}`)
        .pipe(({ message }) => ({ // format stream contents before downstream consumers
          ...message,
          text: message.text.substring(prompt.length)
        }))

      return {
        async prompt (string, participantIds = members) { // get result from first user who answers
          return new Promise(resolve => {
            messengerService.respond(context, string)
            const stream = channelListener.pipe(message => {
              const { user } = message
              if (participantIds.includes(user.id)) {
                stream.end()
                resolve(message)
              }
            })
          })
        },

        observe (participantIds = members) {
          const observerStream = channelListener.pipe(message => {
            const { user } = message
            if (participantIds.includes(user.id)) {
              return message
            }
          })

          return observerStream
        },

        send (message) {
          messengerService.respond(context, message)
        }
      }
    }
  }
}

export default interaction
