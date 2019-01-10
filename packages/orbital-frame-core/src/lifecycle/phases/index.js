import phase from '../phase'
import startPhase from './start'
import registerPluginsPhase from './registerPlugins'
import registerCommandsPhase from './registerCommands'
import listenPhase from './listen'
import processPhase from './process'
import executePhase from './execute'
import respondPhase from './respond'

export default {
  START: phase(startPhase),
  REGISTER_PLUGINS: phase(registerPluginsPhase),
  REGISTER_COMMANDS: phase(registerCommandsPhase),
  LISTEN: phase(listenPhase),
  PROCESS: phase(processPhase),
  EXECUTE: phase(executePhase),
  RESPOND: phase(respondPhase)
}
