export default ({ jobService, interactionService }) => ({
  name: 'fg',
  synopsis: 'fg [JOB ID]',
  description: 'Foreground an interactive job',
  async execute ([ jobId ]) {
    const { userId } = await jobService.findOne({ 'command.pid': this.pid })

    await interactionService.foreground(userId, jobId)
  }
})
