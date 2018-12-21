/**
 * The frame exposes the bot and instantiation options to
 * the service host and provides a uniform API between bot types (eventually)
 * @param {Hubot} robot
 * @param {Object} options
 */
function frame (robot, options) {
  const {name} = options

  return {
    name,
    hear: robot.hear.bind(robot)
  }
}

export default frame
