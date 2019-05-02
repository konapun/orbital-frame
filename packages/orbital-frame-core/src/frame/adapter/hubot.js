// TODO: slack (used to?) use ” and “ for double quotes and ‘ and ’ for single quotes for do a replace on `hear`
function hubotAdapter (hubot) {
  return {
    hear: hubot.hear.bind(hubot), // TODO: adapt response as well; need res.message.user => ({ id, name }), etc.
    send: hubot.messageRoom.bind(hubot),
    async getUsers () {
      return await Object.values(hubot.brain.data.users).map(({ id, name }) => ({ id, name }))
    },
    async getChannels () {
      return [] // TODO: find out how to do this
    }
  }
}

export default hubotAdapter
