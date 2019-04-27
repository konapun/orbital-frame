import corePlugins from '../../plugins'

const loadPlugins = ({ configService, pluginService }) => next => args => {
  const plugins = [ ...corePlugins, ...configService.plugins ]
  pluginService.load(plugins)
  next(args)
}

export default loadPlugins
