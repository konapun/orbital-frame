import search from '../util/search'
import cyclicIncrementor from '../util/cyclicIncrementor'

const idGenerator = cyclicIncrementor(1)
const jobs = {}
const subscriptions = {}

const status = {
  PENDING: 'pending',
  RUNNING: 'running',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

const job = () => () => {
  const list = async () => await Object.values(jobs)
  const { find, findOne } = search(list)

  return {
    subscribe (id, handler) {
      if (!subscriptions[id]) subscriptions[id] = []
      subscriptions[id].push(handler)
      return {
        unsubscribe: () => {
          subscriptions[id] = subscriptions[id].filter(fn => fn !== handler)
        }
      }
    },

    create (userId, overrides) {
      const jobId = idGenerator.next()
      const newJob = { // TODO: use joi for schema validation
        id: jobId,
        userId,
        context: null,
        command: null,
        source: null,
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
      if (subscriptions[id]) {
        subscriptions[id].forEach(fn => fn(updated, job[id]))
      }

      jobs[id] = updated
      return updated
    },

    destroy (id) {
      delete jobs[id]
      delete subscriptions[id]
    },

    status,
    find,
    findOne,
    list
  }
}

export default job
