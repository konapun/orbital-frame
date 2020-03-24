function state () {
  const root = {}
  const scoped = {}

  return {
    set (key, value, options = {}) {
      const { readonly, scope } = options

      let store = root
      if (scope) {
        if (!scoped[scope]) scoped[scope] = {}
        store = scoped[scope]
      }

      const contained = store[key]
      if (contained && contained.readonly) {
        return false
      }
      store[key] = { value, readonly }
      return true
    },
    get (key, options = {}) {
      const { scope } = options

      if (scope) {
        const contained = scoped[scope] && scoped[scope][key]
        if (contained) return contained.value
      } // fall through and check for value in root scope if no scoped value was found for the key
      const contained = root[key]
      if (contained) return contained.value // TODO: clean this up once optional chaining is enabled
    }
  }
}

export default state
