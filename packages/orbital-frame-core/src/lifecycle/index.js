import phase from './phase'
import start from './start'
import registerPlugins from './registerPlugins'
import registerCommands from './registerCommands'
import listen from './listen'
import process from './process'
import execute from './execute'
import respond from './respond'
import shutdown from './shutdown'

/**
 * The lifecycle is a extensible state machine configured with the following
 * default points:
 *  - START_UP
 *  - REGISTER_PLUGINS
 *  - REGISTER_COMMANDS
 *  - [{ LISTEN
 *  -   PROCESS
 *  -   EXECUTE
 *  -   RESPOND
 *    } | SHUT_DOWN]
 */

//TODO: define lifecycle points separately, invoke in js controls (loops, etc)

export const Phase = {
  START_UP: phase(start),
  REGISTER_PLUGINS: phase(registerPlugins),
  REGISTER_COMMANDS: phase(registerCommands),
  LISTEN: phase(listen),
  PROCESS_INPUT: phase(process),
  EXECUTE: phase(execute),
  RESPOND: phase(respond),
  SHUT_DOWN: phase(shutdown)
}

export default {
  run () {
    Phase.START_UP()
    Phase.REGISTER_PLUGINS()
    Phase.REGISTER_COMMANDS()
    Phase.LISTEN() // FIXME:
  }
}
