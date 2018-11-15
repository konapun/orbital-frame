import lifecycle from './lifecycle'
import serviceHost from './service/host'

export default robot => {
  serviceHost.instantiate(robot) // initialize services
  lifecycle.run() // lifecycle phases communicate via services
}
