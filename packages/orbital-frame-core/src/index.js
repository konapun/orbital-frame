import awilix from 'awilix'
import serviceRegistry from './service'
import lifecycle from './lifecycle'
import frame from './frame'

const container = awilix.createContainer({
  injectionMode: awilix.injectionMode.PROXY
})

export default (robot, options) => {
  const adapter = frame(robot, options) //{ name: 'orbital-frame', ...options })
  serviceRegistry.initialize(adapter, container)

  return {
    run () {
      lifecycle.run() // lifecycle phases communicate via services
    }
  }
}
