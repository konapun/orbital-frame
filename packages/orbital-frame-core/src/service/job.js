let id = 1
const jobs = {}

const status = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

const job = () => () => ({
  status,

  create (userId, overrides) {
    const jobId = id++
    const newJob = {
      id: jobId,
      userId,
      context: null,
      command: null,
      status: status.PENDING,
      started: Date.now(),
      finished: null,
      output: null,
      ...overrides
    }

    jobs[jobId] = newJob
    return newJob
  },

  update (id, criteria) {
    if (!jobs[id]) {
      throw new Error(`No such job with id ${id}`)
    }
    const updated = { ...jobs[id], ...criteria }
    jobs[id] = updated
    return updated
  },

  find (criteria) {
    // TODO
  },

  findOne (criteria) {
    // TODO
  },

  list () {
    return Object.values(jobs)
  }
})

export default job
