function serviceHost (serviceApi) {
  const subscribers = []

  return {
    register (subscriber) {
      subscribers.push(subscriber)
    },

    notify (message) {

    }
  }
}

export default serviceHost
