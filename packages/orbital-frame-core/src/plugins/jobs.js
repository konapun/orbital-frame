import { phaseEnum } from '../lifecycle'

const MAX_RETENTION = 5

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
    [phaseEnum.PROCESS]: {
      exit ({ source, state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          source
        })
      }
    },
    [phaseEnum.EXECUTE]: {
      enter ({ command, state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          command, // command can be linked back to job by command.id
          status: jobService.status.RUNNING
        })
      },
      exit ({ output, state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          status: jobService.status.FULFILLED,
          output,
          finished: Date.now()
        })

        // cleanup
        jobService.find({ status: jobService.status.FULFILLED }).then(fulfilledJobs => {
          if (fulfilledJobs.length > MAX_RETENTION) {
            fulfilledJobs.forEach(({ id }, index) => index < fulfilledJobs.length - MAX_RETENTION && jobService.destroy(id))
          }
        })
      },
      error (err, { state }) {
        const job = state.get(`${namespace}.job`)
        jobService.update(job.id, {
          status: jobService.status.REJECTED,
          finished: Date.now()
        })

        // cleanup
        jobService.find({ status: jobService.status.REJECTED }).then(rejectedJobs => {
          if (rejectedJobs.length > MAX_RETENTION) {
            rejectedJobs.forEach(({ id }, index) => index < rejectedJobs.length - MAX_RETENTION && jobService.destroy(id))
          }
        })
      }
    }
  }
}

export default jobsPlugin
