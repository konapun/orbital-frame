export default ({ interactionService, signalService, configService }) => ({
  name: 'observer',
  synopsis: 'observer',
  description: `An example of a command which uses observable interactions. To respond to this command, prepend your message with "${configService.ps2}".`,
  async execute () {
    const interaction = await interactionService.createInteractionChannel()
    const signalHandler = await signalService.createSignalHandler()
    const stream = interaction.observe()

    let paused = false
    return new Promise(resolve => {
      signalHandler.onSignal(signalService.signal.SIGSTP, () => {
        paused = true
      })
      signalHandler.onSignal(signalService.signal.SIGRES, () => {
        paused = false
      })
      signalHandler.onSignal(signalService.signal.SIGINT, () => {
        stream.end()
        resolve('Caught signal SIGINT; exiting')
      })

      stream.pipe(({ user, text }) => {
        if (text.trim() === 'exit') {
          resolve('Exiting')
          stream.end()
        } else if (!paused) {
          interaction.send(`User ${user.name} sent message: ${text}`)
        }
      })
    })
  }
})
