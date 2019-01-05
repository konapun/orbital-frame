function hubotAdapter (hubot) {
  return {
    hear: hubot.hear.bind(hubot), // TODO: adapt response as well
    send: hubot.messageRoom.bind(hubot)
  }
}

export default hubotAdapter
