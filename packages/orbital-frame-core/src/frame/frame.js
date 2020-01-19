import adapter from './adapter'

const defaults = {
  name: 'orbital-frame',
  ps2: '>',
  commands: [],
  plugins: [],
  adapter: adapter.HUBOT
}

/**
 * The frame exposes the bot and instantiation options to
 * the service host and provides a uniform API between bot types
 */
function frame (sensors, options) {
  const { name, ps2, commands, plugins, adapter } = { ...defaults, ...options }

  const { hear, send, getUsers, getChannels } = adapter(sensors)
  return {
    name,
    ps2,
    commands,
    plugins,
    hear,
    send,
    getUsers,
    getChannels,
    adapter: sensors // this should only be used in orbital-frame clients since it will be closely bound to the specific adapter
  }
}

export default frame
