function controller (players) {
  let activeIndex = 0
  const isActivePlayer = id => players[activeIndex].id === id
  const nextTurn = () => {
    if (activeIndex + 1 >= players.length) {
      activeIndex = 0
    } else {
      activeIndex++
    }
  }

  const mappedPlayers = players.reduce((acc, player) => ({ ...acc, [player.id]: player }), {})
  return ({ user, text }) => {
    const player = mappedPlayers[user.id]
    if (isActivePlayer(player.id)) {
      player.process(text)
      nextTurn() // TODO: advance turn if action can only happen during the active phase
    } else {
      // TODO: process action for background player
    }
  }
}

export default controller
