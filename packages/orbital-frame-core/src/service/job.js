import search from '../util/search'
import cyclicIncrementor from '../util/cyclicIncrementor'

const idGenerator = cyclicIncrementor(1)
const jobs = {}

const status = {
  PENDING: 'pending',
  RUNNING: 'running',
  PAUSED: 'paused', // if a command is backgrounded
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

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
      jobs[id] = updated
      return updated
    },

    // TODO: also store the command source that spawned the job (or is this already done?)
    status,
    find,
    findOne,
    list
  }
}

export default job
