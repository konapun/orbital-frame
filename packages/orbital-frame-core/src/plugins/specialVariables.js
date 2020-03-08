import { phaseEnum } from '../lifecycle'

/**
 * Populate variables such as $$, $0, $1, $#, etc.
 */
const specialVariablesPlugin  = ({ environmentService }) => ({
  [phaseEnum.LOAD_PLUGINS]: {
    exit () {
      // TODO:
    }
  },
  [phaseEnum.PROCESS]: {
    exit ({ metadata }) {
      try {
        // FIXME: this will only work for the first command as there's currently no way to extend this at runtime to force a separate positional variable per-command
        const command = metadata.findOne(({ type }) => type === metadata.type.COMMAND)
        environmentService.set(0, command.name)
        command.arguments.forEach((arg, index) => {
          environmentService.set(index + 1, arg)
        })
      } catch (err) {
        // pass
      }
    }
  },
  [phaseEnum.EXECUTE]: {
    /**
     * $#: number of command-line arguments
     * $-: current flags
     * $0: command name
     * $1: first arg
     * $2: second arg
     * $3
     * $4
     * $5
     * $6
     * $7
     * $8
     * $9
     * $*: all arguments on the command line
     *
     */
    enter ({ command }) {
      environmentService.set('!', command.pid) // TODO: should environment state be refreshed every read loop so values can be set readonly?
      // TODO: set positional
    },
    /**
     * $?: exit value of last command
     * $!: pid of last command
     */
    exit () {
      environmentService.set('?', 0)
    },
    error () {
      environmentService.set('?', 1)
    }
  }
})

export default specialVariablesPlugin
