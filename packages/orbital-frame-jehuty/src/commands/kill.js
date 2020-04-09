export default ({ signalService }) => ({
  name: 'kill',
  synopsis: 'kill [JOB ID]',
  description: 'Send a signal to a job',
  options: {
    1: {
      alias: 'SIGINT',
      type: 'boolean',
      description: 'Request a job to interrupt'
    },
    2: {
      alias: 'SIGSTP',
      type: 'boolean',
      description: 'Request a job to stop'
    },
    3: {
      alias: 'SIGRES',
      type: 'boolean',
      description: 'Request a job to resume'
    }
  },
  async execute ([ jobId ], { SIGSTP, SIGRES }) {
    const signal = SIGRES ? 3 :
      SIGSTP ? 2 : 1

    signalService.send(jobId, signal)
  }
})
