function jobs ({ jobService }) {
  return {
    name: 'jobs',
    description: 'TODO',
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
