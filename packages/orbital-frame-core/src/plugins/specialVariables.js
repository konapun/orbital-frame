import { phaseEnum } from '../lifecycle'

/**
 * Populate variables such as $$, $0, $1, $#, etc.
 */
const specialVariablesPlugin  = ({ jobService, environmentService }) => ({
  [phaseEnum.LOAD_PLUGINS]: {
    exit () {
      // TODO:
      console.log('VARIABLES PLUGIN!')
    }
  },
  [phaseEnum.PROCESS]: {
    exit ({ metadata }) {
      console.log('PROCESS returned metadata', metadata.data.pipelines[0].commands[0].options)
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
