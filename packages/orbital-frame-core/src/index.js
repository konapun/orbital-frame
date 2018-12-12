import lifecycle from './lifecycle'
import serviceHost from './service/host'
import frame from './frame'

export default (robot, options) => {
  const name = options.name || 'orbital-frame'
  return {
    run () {
      serviceHost.initialize(frame(robot, options))
      lifecycle.run() // lifecycle phases communicate via services

      robot.hear(new RegExp(`^@${name}\\s`), response => {
        response.send('Core send!')
      })
    }
  }
}
