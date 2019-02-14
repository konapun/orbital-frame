import corePlugins from '../../plugins'

const loadPlugins = ({ configService, pluginService }) => next => () => {
  const plugins = [ ...corePlugins, ...configService.plugins ]
  pluginService.load(plugins)
  next()
}

export default loadPlugins
