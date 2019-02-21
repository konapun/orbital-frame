import { phaseEnum } from '../lifecycle'

/**
 * Use lifecycle phase triggers to keep track of running commands and associate
 * them with users
 */
const jobsPlugin = ({ channelService }) => {
  const namespace = 'core.plugin.job'
  const jobs = []

  return {
    [phaseEnum.LISTEN]: {
      exit ({ context, state }) {
        const { id } = context.message.user // TODO: make sure adapter follows this format
        state.set(`${namespace}.id`, id)
      }
    },
    [phaseEnum.EXECUTE]: {
      enter ({ command, state }) {
        const userId = state.get(`${namespace}.id`)
        console.log('EXECUTING from user', userId)
        // TODO: Associate user with command and add to jobs
      },
      exit ({ output, state }) {
        // TODO: mark job as complete
        console.log('EXECUTED:', output)
      }
    }
  }
}

export default jobsPlugin
