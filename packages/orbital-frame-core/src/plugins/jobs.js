import { phaseEnum } from '../lifecycle'

/**
 * Use lifecycle phase triggers to keep track of running commands and associate
 * them with users
 */
const jobsPlugin = () => {
  let userId // TODO: make sure this works with an async, multi-user flow
  const jobs = []

  return {
    [phaseEnum.LOAD_PLUGINS]: {
      exit () {
        console.log('JOBS PLUGIN!')
      }
    },
    [phaseEnum.LISTEN]: {
      exit (context) {
        const { id } = context.message.user // TODO: make sure adapter follows this format
        userId = id
      }
    },
    [phaseEnum.EXECUTE]: {
      enter (executable) {
        console.log('EXECUTING from user', userId)
        // TODO: Associate user with command and add to jobs
      },
      exit (output) {
        // TODO: mark job as complete
        console.log('EXECUTED:', output)
      }
    }
  }
}

export default jobsPlugin
