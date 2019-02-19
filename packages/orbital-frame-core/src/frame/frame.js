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
  const { name, plugins, commands, adapter } = { ...defaults, ...options }

  const { hear, send, getUsers, getChannels, adapter: frameAdapter } = adapter(sensors)
  return {
    name,
    plugins,
    commands,
    hear,
    send,
    getUsers,
    getChannels,
    adapter: frameAdapter // this should only be used in orbital-frame clients since it will be closely bound to the specific adapter
  }
}

export default frame
