export default ({ interactionService }) => ({
  name: 'observer',
  description: 'Testing observable interactions',
  async execute (...args) {
    console.log('ARGS:', args)

    const pid = this.pid
    // console.log('Have PID', pid)
    // console.log('Have args', args)
    // console.log('Have opts', opts)
    // console.log('Have metadata', metadata)
    const interaction = await interactionService.createInteractionChannel(pid)
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
