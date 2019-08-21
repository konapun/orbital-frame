// TODO: slack (used to?) use ” and “ for double quotes and ‘ and ’ for single quotes for do a replace on `hear`
function hubotAdapter (hubot) {
  return {
    hear (matcher, callback) {
      return hubot.hear(matcher, response => {
        const { message } = response
        const { user, text, room: channel } = message

        return callback({
          message: { user, text, channel },
          send (message) {
            response.send(message)
          },
          reply (message) {
            response.reply(message)
          }
        })
      })
    },
    send (channel, message) {
      return hubot.messageRoom(channel, message)
    },
    async getUsers () {
      return await Object.values(hubot.brain.data.users).map(({ id, name }) => ({ id, name }))
    },
    async getChannels () {
      return [] // TODO: find out how to do this
    }
  }
}

export default hubotAdapter
