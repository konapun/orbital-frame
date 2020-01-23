function jobs ({ jobService }) {
  return {
    name: 'jobs',
    description: 'TODO',
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

const jobToString = ({ id, userId, status, started, finished, source }) => {
  const baseString = [
    `ID: ${id}`,
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
