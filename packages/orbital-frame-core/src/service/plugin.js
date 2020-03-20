import { phase as phases } from '../lifecycle'
import { ValidationError } from '../error'

const loadOne = plugin => {
  Object.entries(plugin).forEach(([ pluginPhase, actionDefinition ]) => {
    if (!(pluginPhase in phases)) {
      throw new ValidationError(`Can't register plugin action for key "${pluginPhase}" (available keys are ${Object.keys(phases).join(' ')})`)
    }

    phases[pluginPhase].extend(actionDefinition)
  })
}

const pluginService = () => services => ({
  load (plugins) {
    [].concat(plugins)
      .map(pluginDefinition => pluginDefinition(services))
      .forEach(plugin => loadOne(plugin))
  }
})

export default pluginService
