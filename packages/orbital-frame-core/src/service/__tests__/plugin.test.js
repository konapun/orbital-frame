import pluginService from '../plugin'

const services = {}

describe('plugin service', () => {
  const pluginLoader = pluginService()(services)

  const validPlugin = () => ({
    loadPlugins: {},
    loadCommands: {},
    listen: {},
    process: {},
    execute: {},
    respond: {}
  })

  const invalidPlugin = () => ({
    fakePhase: {
      enter: () => {},
      exit: () => {}
    }
  })

  it('should throw an error when trying to load a malformed plugin', () => {
    expect(() => pluginLoader.load(invalidPlugin)).toThrow()
  })

  it('should load a single plugin', () => {
    expect(() => pluginLoader.load(validPlugin)).not.toThrow()
  })

  it('should throw an error when trying to load multiple plugins with at least one malformed', () => {
    expect(() => pluginLoader.load([ validPlugin, invalidPlugin ])).toThrow()
  })

  it('should load multiple plugins', () => {
    expect(() => pluginLoader.load([ validPlugin, validPlugin ])).not.toThrow()
  })
})
