import compose from 'lodash/fp/compose'
import phase from './phase'
import startPhase from './start'
import registerPluginsPhase from './registerPlugins'
import registerCommandsPhase from './registerCommands'
import listenPhase from './listen'
import processPhase from './process'
import executePhase from './execute'
import respondPhase from './respond'

export const phases = {
  START: phase(startPhase),
  REGISTER_PLUGINS: phase(registerPluginsPhase),
  REGISTER_COMMANDS: phase(registerCommandsPhase),
  LISTEN: phase(listenPhase),
  PROCESS: phase(processPhase),
  EXECUTE: phase(executePhase),
  RESPOND: phase(respondPhase)
}

// Add start and end phases to enforce regularity in normal lifecycle phases
const primeLifecycle = phases => [
  ...phases,
  () => () => () => {}
]

const lifecycle = services => {
  const startLifecycle = compose(primeLifecycle(Object.values(phases).map(phase => phase.call(services))))

  return {
    run: startLifecycle()
  }
}

export default lifecycle
