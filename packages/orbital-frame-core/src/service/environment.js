const env = {}
const environment = () => () => ({
  get (key) {
    return env[key]
  },

  set (key, value) {
    env[key] = value
  }
})

export default environment
