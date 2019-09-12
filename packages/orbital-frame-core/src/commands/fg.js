/**
 * Foreground a stopped job
 *
 * Job descriptors can be a process ID or one of the following:
 * - %, %+, or %% to refer to current job
 * - %- to refer to previous job
 */
function fg ({ jobService }) {
  const parseDescriptor = descriptor => 1

  return {
    name: 'fg',
    description: 'Foreground a stopped job',
    execute ([ jobDescriptor ]) {
      const job = parseDescriptor(jobDescriptor)
      if (job.status !== jobService.status.STOPPED) {
        throw new Error(`Cannot foreground job. Status was ${job.status}`)
      }

      // TODO: only one job per user can be in state RUNNING
      jobService.update(job.id, {
        status: jobService.status.RUNNING
      })
    }
  }
  // TODO:
}

export default fg
