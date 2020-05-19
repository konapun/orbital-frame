import game from './game'
import { uniq } from 'lodash'

export default ({ userService, interactionService }) => ({
  name: 'game-example',
  synopsis: 'game-example [USER ID] ...[USER IDS]',
  description: 'An example of a multiuser turn-based game',
  async execute (userIds) {
    const owner = await userService.getCurrentUser()
    const interaction = await interactionService.createInteractionChannel(userIds)
    const stream = interaction.observe()
    const users = await Promise.all(uniq([ ...userIds, owner.id ]).map(id => userService.findOne({ id })))

    return new Promise(resolve => {
      const run = game(users, resolve)
      stream.pipe(run)
    })
  }
})
