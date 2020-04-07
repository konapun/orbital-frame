import { StateError, PermissionError } from '../error'

const userFocus = {} // track active job per user
const interactions = {}

/**
 * Service for backgrounding for interactive commands
 */
const interaction = () => ({ configService, environmentService, jobService, listenerService, messengerService }) => {
  const prompt = configService.ps2

  return {
    async createInteractionChannel (userIds = []) {
      const pid = environmentService.get('!')
      if (interactions[pid]) {
        throw new Error(`Interaction already running for pid ${pid}`)
      }

      const { id, context, userId } = await jobService.findOne({ 'command.pid': pid })
      const members = [ userId, ...userIds ]
      const channelListener = listenerService.listen(`^${prompt}`)
        .pipe(({ message }) => ({ // format stream contents before downstream consumers
          ...message,
          text: message.text.substring(prompt.length)
        }))

      // only deliver message if the sender in in the included users
      const userGate = message => members.includes(message.user.id) ? message : null

      // only activate pipe for the active interaction for a user
      const delegateMessage = message => userFocus[message.user.id] === pid ? message : null

      const getInteractionPipe = () => channelListener.pipe(userGate).pipe(delegateMessage)

      interactions[pid] = members
      jobService.subscribe(id, job => {
        if (!job.status !== jobService.status.RUNNING) {
          delete interactions[job.command.pid]
        }
      })

      return {
        async prompt (string) { // get result from first user who answers
          members.forEach(id => userFocus[id] = pid)

          return new Promise(resolve => {
            messengerService.respond(context, string)
            const stream = getInteractionPipe().pipe(message => {
              stream.end()
              resolve(message)
            })
          })
        },

        observe () {
          members.forEach(id => userFocus[id] = pid)

          return getInteractionPipe()
        },

        send (message) {
          messengerService.respond(context, message)
        }
      }
    },

    async foreground (userId, jobId) {
      const job = await jobService.findOne({ id: jobId })
      if (job.status !== jobService.status.RUNNING) {
        throw new StateError('Cannot foreground a job which is not running')
      }
      if (!interactions[job.command.pid].includes(userId)) {
        throw new PermissionError('Cannot foreground a job which this user does not belong to')
      }

      userFocus[userId] = job.command.pid
    }
  }
}

export default interaction
