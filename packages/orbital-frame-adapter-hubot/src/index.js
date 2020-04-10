function hubotAdapter (hubot) { // TODO: config
  const adapterName = hubot.adapterName

  return {
    ps1: '@', // this symbol is used to hail a user/bot
    hear (matcher, callback) {
      return hubot.hear(matcher, response => {
        const { message } = processResponseForAdapter(adapterName, response)
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

const processResponseForAdapter = (name, response) => {
  switch (name) {
  case 'slack':
    return {
      ...response,
      message: {
        ...response.message,
        text: processSlackText(response.message.text)
      }
    }
  default:
    return response
  }
}

const processSlackText = text => {
  return text.replace(/```/g, '') // remove code blocks
}

export default hubotAdapter
