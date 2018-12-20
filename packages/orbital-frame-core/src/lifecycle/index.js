import phase from './phase'
import start from './start'
import registerPlugins from './registerPlugins'
import registerCommands from './registerCommands'
import main from './main'
import listen from './main/listen'
import process from './main/process'
import execute from './main/execute'
import respond from './main/respond'
import shutdown from './shutdown'
import {flow} from 'lodash/fp'

// TODO: awilix - each lifecycle phase should have access to services (see main/listen as example); next() flows
/**
 * The lifecycle is a extensible state machine configured with the following
 * default points:
 *  - START_UP
 *  - REGISTER_PLUGINS
 *  - REGISTER_COMMANDS
 *  - MAIN: [{ LISTEN
 *  -   PROCESS
 *  -   EXECUTE
 *  -   RESPOND
 *    } | SHUT_DOWN]
 */

export const Phase = {
  START_UP: phase(start),
  REGISTER_PLUGINS: phase(registerPlugins),
  REGISTER_COMMANDS: phase(registerCommands),
  MAIN: phase(main),
  LISTEN: phase(listen),
  PROCESS_INPUT: phase(process),
  EXECUTE: phase(execute),
  RESPOND: phase(respond),
  SHUT_DOWN: phase(shutdown)
}

/**
 * Use output from one phase as input to the next
 * @param {Array<phase>} phases
 */
export const chain = flow

export default {
  run () {
    Phase.START_UP()
    Phase.REGISTER_PLUGINS()
    Phase.REGISTER_COMMANDS()
    Phase.MAIN()
  }
}
