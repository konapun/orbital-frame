import { phaseEnum } from '../lifecycle'

/**
 * Use lifecycle phase triggers to keep track of running commands and associate
 * them with users
 */
const jobsPlugin = ({ jobService }) => {
  const namespace = 'core.plugin.job'

  return {
    [phaseEnum.LISTEN]: {
      exit ({ context, state }) {
        const { id } = context.message.user
        const job = jobService.create(id, { context })
        state.set(`${namespace}.job`, job)
      }
    },
    [phaseEnum.EXECUTE]: {
      enter ({ command, state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          command, // command can be linked back to job by command.id
          status: jobService.status.RUNNING // TODO: enforce that this status accurately reflects the state of running commands; if a user copies the interaction service functionality without going through it the correct behavior with regards to fg/bg processes should remain intact
        })
      },
      exit ({ output, state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          status: jobService.status.FULFILLED,
          output,
          finished: Date.now()
        })
      },
      error (err, { state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          status: jobService.status.REJECTED,
          finished: Date.now()
        })
      }
    }
  }
}

export default jobsPlugin
