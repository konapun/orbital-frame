import player from './player'
import map from './map'
import controller from './controller'

function game (users, resolve) {
  const players = users.map(user => player(user, map.spawn))

  players[0].move('left')
  return message => controller(message, {
    onExit: resolve
  })
}

export default game
