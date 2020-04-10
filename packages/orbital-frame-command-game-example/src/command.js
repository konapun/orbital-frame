import game from './game'

export default ({ userService, interactionService }) => ({
  name: 'game-example',
  synopsis: 'game-example [USER ID] ...[USER IDS]',
  async execute (userIds) {
    const interaction = await interactionService.createInteractionChannel(userIds)
    const stream = interaction.observe()
    const users = await Promise.all(userIds.map(id => userService.findOne({ id })))

    return new Promise(resolve => {
      const run = game(users, resolve)
      stream.pipe(run)
    })
  }
})
