function jobs ({ jobService }) {
  return {
    name: 'jobs',
    description: 'TODO',
    options: {},
    execute () {
      console.log(jobService.list())
      return jobService.list()
    }
  }
}

export default jobs
