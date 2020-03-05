import jobService from '../job'

Date.now = jest.fn(() => 12345)

describe('job service', () => {
  const job = jobService()()

  it('should allow creating new jobs', () => {
    const created = job.create('job1')
    expect(created).toEqual({ command: null, source: null, context: null, finished: null, id: 1, localId: 1, output: null, started: 12345, status: 'pending', userId: 'job1' })
  })

  it('should allow creating new jobs with overridden defaults', () => {
    const created = job.create('job2', {
      userId: 'konapun'
    })
    expect(created).toEqual({ command: null, source: null, context: null, finished: null, id: 2, localId: 1, output: null, started: 12345, status: 'pending', userId: 'konapun' })
  })

  it('should allow updating jobs', () => {
    const updated = job.update(1, {
      status: job.status.FULFILLED
    })
    expect(updated).toEqual({ command: null, source: null, context: null, finished: null, id: 1, localId: 1, output: null, started: 12345, status: 'fulfilled', userId: 'job1' })
  })

  it('should throw an error if attempting to update a job with an unknown id', () => {
    expect(() => job.update(9001, {
      status: job.status.FULFILLED
    })).toThrow()
  })

  it('should notify subscribers when a job is updated', () => {
    const subscriptionFn = jest.fn()
    job.subscribe(1, subscriptionFn)

    job.update(1, {
      source: 'hi'
    })

    expect(subscriptionFn).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      source: 'hi'
    }), undefined)
  })

  it('should allow subscriptions to unsubscribe', () => {
    const subscription1Fn = jest.fn()
    const subscription2Fn = jest.fn()
    const subscription1 = job.subscribe(1, subscription1Fn)
    job.subscribe(1, subscription2Fn)

    subscription1.unsubscribe()

    job.update(1, {
      source: 'hi'
    })

    expect(subscription1Fn).not.toHaveBeenCalled()
    expect(subscription2Fn).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      source: 'hi'
    }), undefined)
  })

  it('should support finding jobs', () => {
    expect(job.find).toBeDefined()
  })

  it('should support finding a single job', () => {
    expect(job.findOne).toBeDefined()
  })

  it('should list all known jobs', async () => {
    const jobs = await job.list()
    expect(jobs).toHaveLength(2)
  })

  it('should keep track of a job\'s local id', () => {
    const userId = 'konapun'
    const user1Job1 = job.create(userId)
    const user2Job1 = job.create('otherUser')
    const user1Job2 = job.create(userId)

    expect(user1Job1.id).toBe(3)
    expect(user2Job1.id).toBe(4)
    expect(user1Job2.id).toBe(5)

    expect(user1Job1.localId).toBe(1)
    expect(user2Job1.localId).toBe(1)
    expect(user1Job2.localId).toBe(2)
  })
})
