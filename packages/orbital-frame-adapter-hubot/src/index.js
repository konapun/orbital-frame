function hubotAdapter (hubot) { // TODO: config
  return {
    ps1: '@', // this symbol is used to hail a user/bot
    hear (matcher, callback) {
      return hubot.hear(matcher, response => {
        const { message } = response
        const { user, text, room: channel } = message

        return callback({
          message: {
            user: {
              id: user.id,
              name: user.name
            },
            text,
            channel
          },
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
      return Object.values(hubot.brain.data.users)
    },
    async getChannels () {
      return [] // TODO: find out how to do this
    }
  }
}

export default hubotAdapter
