import player from './player'
import map from './map'
import controller from './controller'

function game (users, resolve) {
  const players = users.map(user => player(user, map.spawn))

  const handle = controller(players)
  return message => handle(message, {
    onExit: resolve
  })
}

export default game
