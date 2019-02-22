function jobs ({ jobService }) {
  return {
    name: 'jobs',
    description: 'TODO',
    format (output) {
      // TODO: should have a default formatter in core for list output, etc
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

export default jobs
