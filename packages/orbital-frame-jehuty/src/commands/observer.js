export default ({ interactionService, signalService }) => ({
  name: 'observer',
  description: 'Testing observable interactions',
  async execute () {
    const pid = this.pid

    const interaction = await interactionService.createInteractionChannel(pid)
    const signalHandler = await signalService.createSignalHandler(pid)
    const stream = interaction.observe()

    return new Promise(resolve => {
      signalHandler.onSignal(signalService.signal.SIGINT, () => {
        stream.end()
        resolve('Caught signal SIGINT; exiting')
      })

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
