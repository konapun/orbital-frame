import {createContainer, InjectionMode} from 'awilix'
import serviceRegistry from './service'
import lifecycle from './lifecycle'
import frame from './frame'

const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

export default (robot, options) => {
  const adapter = frame(robot, options) //{ name: 'orbital-frame', ...options })
  serviceRegistry(container).initialize(adapter)

  return {
    run () {
      lifecycle(container.cradle).run() // lifecycle phases communicate via services
    }
  }
}
