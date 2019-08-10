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
      const val = store[key]
      if (val) {
        return val.value
      }
    }
  }
}

export default state
