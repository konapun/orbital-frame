// TODO: slack (used to?) use ” and “ for double quotes and ‘ and ’ for single quotes for do a replace on `hear`
function hubotAdapter (hubot) {
  return {
    hear: hubot.hear.bind(hubot), // TODO: adapt response as well
    send: hubot.messageRoom.bind(hubot)
    // TODO: expose additional functionality for slack and the like?
  }
}

export default hubotAdapter
