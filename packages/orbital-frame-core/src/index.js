import { createContainer, InjectionMode } from 'awilix'
import serviceRegistry from './service'
import lifecycle from './lifecycle'
import frame, { adapter } from './frame'

const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

export default (robot, options) => {
  const sensors = frame(robot, options)
  serviceRegistry(container).initialize(sensors)

  return {
    run () {
      lifecycle(container.cradle).run() // lifecycle phases communicate via services
    }
  }
}

export { adapter }
