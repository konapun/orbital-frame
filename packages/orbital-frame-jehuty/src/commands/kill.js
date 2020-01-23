export default ({ signalService, jobService }) => ({
  name: 'kill',
  description: 'Send a signal to a job',
  options: {
    1: {
      alias: 'SIGINT',
      type: 'boolean',
      describe: 'Request a job to interrupt'
    },
    2: { // SIGSTP
      alias: 'SIGSTP',
      type: 'boolean',
      describe: 'Request a job to stop'
    },
    3: { // SIGRES
      alias: 'SIGRES',
      type: 'boolean',
      describe: 'Request a job to resume'
    }
  },
  async execute ([ jobId ], { SIGSTP, SIGRES }) {
    const signal = SIGRES ? 3 :
      SIGSTP ? 2 : 1

    console.log('SENDING SIGNAL', signal)
    const { command } = await jobService.findOne({ id: jobId })
    signalService.send(command.pid, signal)
  }
})
