import memoryEngine from './memoryEngine'

const defaults = {
  name: 'orbital-frame',
  ps1: '@', // symbol used to hail a user
  ps2: '>', // symbol used to engage an interaction
  commands: [],
  plugins: [],
  rootUsers: [],
  storageEngine: memoryEngine()
}

/**
 * The frame exposes the bot and instantiation options to
 * the service host and provides a uniform API between bot types
 */
function frame (adapter, options) {
  const { name, ps2, commands, plugins, rootUsers, storageEngine } = { ...defaults, ...options }

  const { ps1, hear, send, getUsers, getChannels } = adapter
  return {
    name,
    ps1,
    ps2,
    commands,
    plugins,
    rootUsers,
    hear,
    send,
    getUsers,
    getChannels,
    adapter, // this should only be used in orbital-frame clients since it will be closely bound to the specific adapter
    storageEngine
  }
}

export default frame
