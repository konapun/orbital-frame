import serviceHost from './host'
import { BOT } from './index'

export default {
  listen (matcher, callback) {
    return serviceHost.getService(BOT)
    return serviceHost.serviceLayer.hear(matcher)
  }
}
