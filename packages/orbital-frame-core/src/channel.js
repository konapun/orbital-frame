/**
const echoChannel = Channel.open([user], { // a channel can have multiple receivers
  receive (message) {
    if (message.text === 'close') {
      channel.close()
    } else {
      channel.send(message)
    }
  }
})
*/

export default class Channel {
  constructor () {
    this.isOpen = false
  }

  static open (receivers) {
    const channel = new Channel()

  }

  send (message) {

  }

  close () {

  }
}
