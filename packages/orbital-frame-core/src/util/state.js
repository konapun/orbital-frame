function state () {
  const store = {}

  return {
    set (key, value) {
      store[key] = value
    },
    get (key) {
      return store[key]
    }
  }
}

export default state
