/**
 * Background a running job
 *
 * Job descriptors can be a process ID or one of the following:
 * - %, %+, or %% to refer to current job
 * - %- to refer to previous job
 */
function bg ({ jobService }) {
  const parseDescriptor = descriptor => 1

  return {
    name: 'bg',
    description: 'Background a running job',
    execute ([ jobDescriptor ]) {
      const job = parseDescriptor(jobDescriptor)
      if (job.status !== jobService.status.RUNNING) {
        throw new Error(`Cannot background job. Status was ${job.status}`)
      }

      jobService.update(job.id, {
        status: jobService.status.STOPPED
      })
    }
  }
}

export default bg
