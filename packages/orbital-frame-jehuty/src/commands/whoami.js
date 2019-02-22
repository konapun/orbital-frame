function whoami ({ jobService, userService }) {
  return {
    name: 'whoami',
    description: 'TODO',
    options: {},
    async execute () {
      // const commandId = this.id // TODO:
      // const job = await jobService.find({ 'command.id': commandId})
      // const user = await userService.find({ id: job.userId })
      const user = await userService.findOne({ id: 1 })
      return user
    }
  }
}

export default whoami
