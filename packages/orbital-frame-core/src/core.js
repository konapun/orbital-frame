import { createContainer, InjectionMode } from 'awilix'
import serviceRegistry from './service'
import lifecycle from './lifecycle'
import frame from './frame'

const container = createContainer({
  injectionMode: InjectionMode.PROXY
})

export default (adapter, options) => {
  const sensors = frame(adapter, options)
  serviceRegistry(container).initialize(sensors)

  return {
    run () {
      lifecycle(container.cradle).run()
    }
  }
}
