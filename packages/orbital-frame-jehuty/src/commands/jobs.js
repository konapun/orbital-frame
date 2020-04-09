function jobs ({ jobService }) {
  return {
    name: 'jobs',
    synopsis: 'jobs',
    description: 'List jobs and their statuses',
    format (output) {
      return output.map(jobToString).join('\n\n')
    },
    async execute (args) {
      if (args.length === 0) {
        return await jobService.list()
      }
      const [ userId ] = args
      return await jobService.find({ userId })
    }
  }
}

const jobToString = ({ id, userId, status, started, finished, source, command }) => {
  const baseString = [
    `ID: ${id}`,
    `PID: ${command.pid}`,
    `Invoker ID: ${userId}`,
    `Status: ${status}`,
    `Started: ${started}`,
    `Source: ${source}`
  ]
  return (finished ?
    baseString.concat([
      `Finished: ${finished}`
    ]) : baseString
  ).join('\n')
}

export default jobs
