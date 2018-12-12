import serviceHost from './host'

let instance
export default {
  initialize (frame) {
    if (!instance) {
      instance = serviceHost(frame)
    }
  },

  get serviceLayer () {
    return instance
  }
}
