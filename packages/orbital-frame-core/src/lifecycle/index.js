import compose from 'lodash/fp/compose'
import startPhase from './start'
import registerPluginsPhase from './registerPlugins'
import registerCommandsPhase from './registerCommands'
import listenPhase from './listen'
import processPhase from './process'
import executePhase from './execute'
import respondPhase from './respond'

export const phases = {
  START: startPhase,
  REGISTER_PLUGINS: registerPluginsPhase,
  REGISTER_COMMANDS: registerCommandsPhase,
  LISTEN: listenPhase,
  PROCESS: processPhase,
  EXECUTE: executePhase,
  RESPOND: respondPhase
}

/*
 * The lifecycle is used to implement a plugin system. Each phase triggers
 * before/after events which plugins can hook into to modify bot behavior
 */
const makeObservableLifecycle = phasemap => Object.entries(phasemap)
  .map(([event, phase]) => services => next => (...args) => {
    console.log(`BEFORE ${event}`) // TODO: trigger `before` lifecycle event
    try {
      phase(services)(next)(...args)
    } catch (err) {
      // TODO: trigger error event
    }
    console.log(`AFTER ${event}`) // TODO: trigger `after` lifecycle event
  })

// Add start and end phases to enforce regularity in normal lifecycle phases
const primeLifecycle = phases => [
  ...phases,
  () => () => () => {}
]


const lifecycle = services => {
  const startLifecycle = compose(primeLifecycle(makeObservableLifecycle(phases).map(phase => phase(services))))

  return {
    run: startLifecycle()
  }
}

export default lifecycle
