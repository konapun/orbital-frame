export default ({ signalService, jobService }) => ({
  name: 'kill',
  description: 'Send a signal to a job',
  options: {
    1: {
      alias: 'SIGINT',
      type: 'boolean',
      describe: 'Request a job to interrupt'
    },
    2: {
      alias: 'SIGSTP',
      type: 'boolean',
      describe: 'Request a job to stop'
    },
    3: {
      alias: 'SIGRES',
      type: 'boolean',
      describe: 'Request a job to resume'
    }
  },
  async execute ([ jobId ], { SIGSTP, SIGRES }) {
    const signal = SIGRES ? 3 :
      SIGSTP ? 2 : 1

    const { command } = await jobService.findOne({ id: jobId })
    signalService.send(command.pid, signal)
  }
})
