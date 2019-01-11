const loadPlugins = ({configService, pluginService}) => next => () => {
  const plugins = configService.plugins
  pluginService.load(plugins)
  next()
}

export default loadPlugins
