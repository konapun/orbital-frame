import { phaseEnum } from '../lifecycle'

/**
 * Populate variables such as $!, $0, $1, $#, etc.
 */
const specialVariablesPlugin  = ({ environmentService }) => ({
  [phaseEnum.PROCESS]: {
    /**
     * $0: command name
     * $1 ... $n: positional args
     * $#: number of command-line arguments
     * $@: all arguments on the command line (as an array)
     */
    exit ({ metadata }) {
      try {
        const command = metadata.findOne(({ type }) => type === metadata.type.COMMAND)
        environmentService.set(0, command.name)
        command.arguments.forEach((arg, index) => {
          environmentService.set(index + 1, arg)
        })
        environmentService.set('#', command.arguments.length)
        environmentService.set('@', command.arguments)
      } catch (err) {
        // pass
      }
    }
  },
  [phaseEnum.EXECUTE]: {
    /**
     * $!: pid of current command
     */
    enter ({ command }) {
      environmentService.set('!', command.pid)
    },
    /**
     * $?: exit value of last command
     */
    exit () {
      environmentService.set('?', 0)
    },
    error () {
      environmentService.set('?', 1)
    }
  },
  [phaseEnum.RESPOND]: {
    /**
     * Unset variables which are no longer useful outside of execution, such as
     * positional variables
     */
    enter () {
      [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '#', '@' ].forEach(variable => environmentService.set(variable, undefined))
    }
  }
})

export default specialVariablesPlugin
