import { phaseEnum } from '../lifecycle'

/**
 * Use lifecycle phase triggers to keep track of running commands and associate
 * them with users
 */
const jobsPlugin = ({ userService }) => {
  let findUser

  return {
    [phaseEnum.LOAD_PLUGINS]: {
      exit () {
        console.log('JOBS PLUGIN!')
      }
    },
    [phaseEnum.LISTEN]: {
      exit (context) {
        const { id } = context.message.user // TODO: make sure adapter follows this format
        findUser = userService.findOne({ id }) // TODO: will this work with multi-user, multi-async?
      }
    },
    [phaseEnum.EXECUTE]: {
      enter (executable) {
        findUser.then(executor => {
          console.log('EXECUTING from user', executor)
        })
        // TODO: Associate user with command
      },
      exit (output) {
        // TODO: mark job as complete
        console.log('EXECUTED:', output)
      }
    }
  }
}

export default jobsPlugin
