import { phaseEnum } from '../lifecycle'

/**
 * Populate variables such as $$, $0, $1, $#, etc.
 */
const specialVariablesPlugin  = ({ jobService, environmentService }) => ({
  [phaseEnum.LOAD_PLUGINS]: {
    exit () {
      // TODO:
    }
  },
  [phaseEnum.PROCESS]: {
    exit ({ metadata }) {
      try {
        // FIXME: this will only work for the first command as there's currently no way to extend this at runtime
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
    enter ({ command }) { // TODO: command needs its withMetadata compatriots. This should be done in lifecycle
      // TODO: probably need more command data, not just the compiled command
      // console.log('Executing command with id', command.pid)
    },
    /**
     * $?: exit value of last command
     * $!: pid of last command
     * @param {*} param0
     */
    exit ({ command }) {

    }
  }
})

export default specialVariablesPlugin
