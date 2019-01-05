import adapter from './adapter'

const defaults = {
  adapter: adapter.HUBOT,
  name: 'orbital-frame',
  plugins: [],
  commands: []
}

/**
 * The frame exposes the bot and instantiation options to
 * the service host and provides a uniform API between bot types
 */
function frame (sensors, options) {
  const {name, plugins, commands, adapter} = { ...defaults, ...options }

  const { hear, send } = adapter(sensors)
  return {
    name,
    plugins,
    commands,
    hear,
    send
  }
}

export default frame
