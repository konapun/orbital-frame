import {phase as phases} from '../lifecycle'

const loadOne = plugin => {
  Object.entries(plugin).forEach(([pluginPhase, actionDefinition]) => {
    if (!(pluginPhase in phases)) {
      throw new Error(`Can't register plugin action for key "${pluginPhase}" (available keys are ${Object.keys(phases).join(' ')})`)
    }

    phases[pluginPhase].extend(actionDefinition)
  })
}

const pluginService = frame => () => ({
  load (plugins) {
    [].concat(plugins)
      .map(pluginDefinition => pluginDefinition(frame)) // FIXME: pass frame or service cradle?
      .forEach(plugin => loadOne(plugin))
  }
})

export default pluginService
