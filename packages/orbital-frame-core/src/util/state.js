function state () {
  const store = {}

  return {
    set (key, value, readonly = false) {
      const contained = store[key]
      if (contained && contained.readonly) {
        return false
      }
      store[key] = { value, readonly }
      return true
    },
    get (key) {
      const contained = store[key]
      if (contained) {
        return contained.value
      }
    }
  }
}

export default state
