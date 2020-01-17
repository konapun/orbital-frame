import stream from '../util/stream'

const prompt = '>'

/**
 * Service for backgrounding for interactive commands
 */
const interaction = () => ({ jobService, listenerService, messengerService }) => ({
  async createInteractionChannel (commandId, userIds = []) {
    const { context, userId } = await jobService.findOne({ 'command.pid': commandId })
    const participants = [ userId, ...userIds ]
    const channelListener = listenerService.listen(`^${prompt}`)
      .pipe(({ message }) => ({ // format stream contents before downstream consumers
        ...message,
        text: message.text.substring(prompt.length)
      }))

    return {
      async prompt (string, respondentUserIds = participants) { // get result from first user who answers
        return new Promise(resolve => {
          messengerService.respond(context, string)
          const stream = channelListener.pipe(message => {
            const { user } = message
            if (respondentUserIds.includes(user.id)) {
              stream.end()
              resolve(message)
            }
          })
        })
      },

      observe ({ participants = participants, closeStream = tautology }) {
        const observerStream = stream()
        const channelStream = channelListener.pipe(message => {
          const { user } = message
          if (participants.includes(user.id)) {
            if (closeStream()) {
              channelStream.end()
              observerStream.end()
            }

            observerStream.pipe(message)
          }
        })

        return observerStream
      },

      send (message) {
        messengerService.respond(context, message)
      }
    }
  }
})

const tautology = () => true

export default interaction
