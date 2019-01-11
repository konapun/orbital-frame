import phase from '../phase'
import startPhase from './start'
import loadPluginsPhase from './loadPlugins'
import loadCommandsPhase from './loadCommands'
import listenPhase from './listen'
import processPhase from './process'
import executePhase from './execute'
import respondPhase from './respond'

export const phaseEnum = {
  START: 'start',
  LOAD_PLUGINS: 'registerPlugins',
  LOAD_COMMANDS: 'loadCommands',
  LISTEN: 'listen',
  PROCESS: 'process',
  EXECUTE: 'execute',
  RESPOND: 'respond'
}

export default {
  [phaseEnum.START]: phase(startPhase),
  [phaseEnum.LOAD_PLUGINS]: phase(loadPluginsPhase),
  [phaseEnum.LOAD_COMMANDS]: phase(loadCommandsPhase),
  [phaseEnum.LISTEN]: phase(listenPhase),
  [phaseEnum.PROCESS]: phase(processPhase),
  [phaseEnum.EXECUTE]: phase(executePhase),
  [phaseEnum.RESPOND]: phase(respondPhase)
}
