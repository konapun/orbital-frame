import compose from 'lodash/fp/compose'
import startPhase from './start'
import registerPluginsPhase from './registerPlugins'
import registerCommandsPhase from './registerCommands'
import listenPhase from './listen'
import processPhase from './process'
import executePhase from './execute'
import respondPhase from './respond'

const phases = {
  START: startPhase,
  REGISTER_PLUGINS: registerPluginsPhase,
  REGISTER_COMMANDS: registerCommandsPhase,
  LISTEN: listenPhase,
  PROCESS: processPhase,
  EXECUTE: executePhase,
  RESPOND: respondPhase,
  END: () => () => () => {}
}

const standard = (...args) => {
  console.log('TEST')
}

const emittedPhases = Object.entries(phases)
  .map(([event, phase]) => services => next => args => {
    console.log(`BEFORE ${event}`)
    phase(services)(next)(args)
    console.log(`AFTER ${event}`)
  })


const lifecycle = services => {
  const lifecyclePhases = emittedPhases.map(phase => phase(services))
  const executablePhases = compose(lifecyclePhases)

  return {
    run: executablePhases()
  }
}

export default lifecycle
