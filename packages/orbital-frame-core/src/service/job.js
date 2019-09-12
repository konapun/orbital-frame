import search from '../util/search'
import cyclicIncrementor from '../util/cyclicIncrementor'

const idGenerator = cyclicIncrementor(1)
const jobs = {}

/*
 * ->pending -> running <-> stopped
                  +-> fulfilled
                  +-> rejected
 */
const status = {
  PENDING: 'pending',
  STOPPED: 'stopped',
  RUNNING: 'running',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

// TODO: make job manager to handle update constraints
const job = () => () => {
  const list = async () => await Object.values(jobs)
  const { find, findOne } = search(list)

  return {
    create (userId, overrides) {
      const jobId = idGenerator.next()
      const newJob = { // TODO: use joi for schema validation
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

    update (id, updates) { // TODO: use joi for schema validation
      if (!jobs[id]) {
        throw new Error(`No such job with id ${id}`)
      }
      const updated = { ...jobs[id], ...updates }
      // TODO: guard state transitions
      jobs[id] = updated
      return updated
    },

    // TODO: also store the command source that spawned the job (this might already be possible)
    status,
    find,
    findOne,
    list
  }
}

export default job
