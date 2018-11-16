import serviceHost from './host'

let instance
export default {
  initialize (api) {
    if (!instance) {
      instance = serviceHost(api)
    }
  },

  get serviceLayer () {
    return instance
  }
}
