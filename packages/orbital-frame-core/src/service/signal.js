const signals = {
  SIGINT: 1, // polite interrupt
  SIGSTP: 2, // pause
  SIGRES: 3  // resume
}

const registry = {}

const signal = () => ({ jobService }) => ({
  signal: signals,

  send (pid, signal) {
    if (!Object.values(signals).includes(signal)) {
      throw new Error(`Error sending signal ${signal} to pid ${pid}: Unknown signal`)
    }

    if (registry[pid] && registry[pid][signal]) {
      registry[pid][signal]()
    } else {
      throw new Error(`Job with ID ${pid} does not exist, is not running, or does not specify a signal handler for signal ${signal}`)
    }
  },

  async createSignalHandler (pid) {
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
          throw new Error(`Error installing handler for signal ${signal}: Unknown signal`)
        }
        registry[pid][signal] = handler
      }
    }
  }
})

export default signal
