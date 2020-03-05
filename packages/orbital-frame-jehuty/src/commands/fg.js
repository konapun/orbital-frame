export default ({ jobService, interactionService }) => ({
  name: 'fg',
  description: 'foreground an interactive job',
  async execute ([ jobId ]) {
    const { userId } = await jobService.findOne({ 'command.pid': this.pid })

    await interactionService.foreground(userId, jobId)
  }
})
