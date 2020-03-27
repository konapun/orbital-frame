import { PermissionError, ValidationError, SearchError } from '../error'

const signals = {
  SIGINT: 1, // polite interrupt
  SIGSTP: 2, // pause
  SIGRES: 3  // resume
}

const registry = {}

const signal = () => ({ environmentService, jobService, userService, permissionService }) => ({
  signal: signals,

  async send (jobId, signal) {
    if (!Object.values(signals).includes(signal)) {
      throw new ValidationError(`Error sending signal ${signal} to job ID ${jobId}: Unknown signal`)
    }

    const { id: senderId } = await userService.getCurrentUser()
    const { command, userId: consumerId } = await jobService.findOne({ id: jobId })
    if (senderId !== consumerId && !permissionService.isSuperuser(senderId)) {
      throw new PermissionError('Cannot send signal to job owned by another user')
    }

    const pid = command.pid
    if (registry[pid]?.[signal]) {
      registry[pid][signal]()
    } else {
      throw new SearchError(`Job with ID ${pid} does not exist, is not running, or does not specify a signal handler for signal ${signal}`)
    }
  },

  async createSignalHandler () {
    const pid = environmentService.get('!')
    registry[pid] = {}

    const job = await jobService.findOne({ 'command.pid': pid })
    jobService.subscribe(job.id, job => {
      if ([ jobService.status.FULFILLED, jobService.status.REJECTED ].includes(job.status)) {
        delete registry[pid]
      }
    })

    return {
      onSignal (signal, handler) {
        if (!Object.values(signals).includes(signal)) {
          throw new ValidationError(`Error installing handler for signal ${signal}: Unknown signal`)
        }
        registry[pid][signal] = handler
      }
    }
  }
})

export default signal
