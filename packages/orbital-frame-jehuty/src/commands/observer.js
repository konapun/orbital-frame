export default ({ interactionService }) => ({
  name: 'observer',
  description: 'Testing observable interactions',
  async execute () {
    const interaction = await interactionService.createInteractionChannel(this.pid)
    const stream = interaction.observe()

    return new Promise(resolve => {
      stream.pipe(({ user, text }) => {
        if (text === 'exit') {
          resolve('Exiting')
          stream.end()
        } else {
          interaction.send(`User ${user.name} sent message: ${text}`)
        }
      })
    })
  }
})
