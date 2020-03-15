import signalService from '../signal'

let jobService, environmentService, permissionService, userService, subscribeCallback

beforeEach(() => {
  jobService = {
    status: {
      FULFILLED: 0,
      REJECTED: 1
    },
    findOne: jest.fn(async () => Promise.resolve({
      id: 2,
      userId: 3,
      command: {
        pid: 1
      }
    })),
    subscribe (pid, handler) {
      subscribeCallback = handler
    }
  }

  environmentService = {
    get: jest.fn(() => 1)
  }

  permissionService = {
    PermissionError: Error,
    isSuperuser: jest.fn(() => true)
  }

  userService = {
    getCurrentUser: jest.fn(() => ({
      id: 1
    }))
  }
})

describe('signal service', () => {
  it('should trigger a registered handler on signal sent', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })

    const handleFn = jest.fn()

    const handler = await signaler.createSignalHandler()
    handler.onSignal(signaler.signal.SIGINT, handleFn)

    await signaler.send(2, signaler.signal.SIGINT)
    expect(handleFn).toHaveBeenCalled()
  })

  it('should throw an error on attempt to send an unknown signal', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })
    const badSignal = 99

    const handleFn = jest.fn()

    const handler = await signaler.createSignalHandler()
    handler.onSignal(signaler.signal.SIGINT, handleFn)

    let error
    try {
      await signaler.send(1, badSignal)
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('Error sending signal 99 to job ID 1: Unknown signal')
    expect(handleFn).not.toHaveBeenCalled()
  })

  it('should throw an error on attempt to register a handler for an unknown signal', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })
    const badSignal = 99

    const handler = await signaler.createSignalHandler()

    let error
    try {
      handler.onSignal(badSignal, () => {})
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('Error installing handler for signal 99: Unknown signal')
  })

  it('should throw an error on attempting to send a signal to a process that does not register a handler for that signal', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })

    let error
    try {
      await signaler.send(9, signaler.signal.SIGINT)
    } catch ({ message }) {
      error = message
    }
    expect(error).toBe('Job with ID 1 does not exist, is not running, or does not specify a signal handler for signal 1')
  })

  it('should throw an error if the user sending the signal does not own the recipient process and is not a superuser', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })

    jobService.findOne.mockResolvedValueOnce({
      id: 2,
      userId: 4,
      command: {
        pid: 1
      }
    })

    permissionService.isSuperuser.mockReturnValueOnce(false)

    let error
    try {
      await signaler.send(9, signaler.signal.SIGINT)
    } catch ({ message }) {
      error = message
    }
    expect(error).toBe('Cannot send signal to job owned by another user')
  })

  it('should unregister handlers when a job finishes', async () => {
    const signaler = signalService()({ jobService, userService, environmentService, permissionService })

    const handleFn = jest.fn()

    const handler = await signaler.createSignalHandler()
    handler.onSignal(signaler.signal.SIGINT, handleFn)

    subscribeCallback({ // notify that job has finished
      status: 0 // fulfilled
    })

    let error
    try {
      await signaler.send(1, signaler.signal.SIGINT)
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('Job with ID 1 does not exist, is not running, or does not specify a signal handler for signal 1')
    expect(handleFn).not.toHaveBeenCalled()
  })
})
