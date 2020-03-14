import permissionService from '../permission'

const setup = async (userId = 0, overrides = {}) => {
  const settings = {
    get: [],
    ...overrides
  }

  const jobService = {
    findOne: jest.fn(async () => Promise.resolve({
      id: 1,
      userId: userId,
      command: {
        pid: 2
      }
    }))
  }

  const environmentService = {
    get: jest.fn(() => userId)
  }

  const persistenceSet = jest.fn()
  const persistenceGet = jest.fn(() => settings.get)
  const persistenceService = {
    namespace: () => ({
      curry: () => ({
        get: persistenceGet,
        set: persistenceSet
      })
    })
  }

  const permission = await permissionService()({ jobService, environmentService, persistenceService })
  return { permission, jobService, persistenceSet, persistenceGet }
}

describe('permission service', () => {
  it('should initialize from persistence', async () => {
    const { permission, persistenceGet } = await setup(0, { get: [ 1, 2, 3 ]})

    expect(persistenceGet).toHaveBeenCalled()
    expect(permission.isSuperuser(1)).toBe(true)
    expect(permission.isSuperuser(2)).toBe(true)
    expect(permission.isSuperuser(3)).toBe(true)
  })

  describe('as superuser', async () => {
    const { permission, persistenceSet, persistenceGet } = await setup(0)
    expect(persistenceGet).toHaveBeenCalled()

    it('should allow promoting a user to superuser', async () => {
      await permission.promote(13)

      expect(permission.isSuperuser(13)).toBe(true)
      expect(persistenceSet).toHaveBeenCalledWith([ 0, 13 ])
    })

    it('should allow demoting a superuser', async () => {
      const demoted = await permission.demote(13)

      expect(permission.isSuperuser(1)).toBe(false)
      expect(demoted).toBeTrue()
      expect(persistenceSet).toHaveBeenCalledWith([ 0 ])
    })

    it('should not allow the root user to be demoted', async () => {
      let error = 'none'
      try {
        await permission.demote(0)
      } catch ({ message }) {
        error = message
      }

      expect(error).toBe('Root user cannot be demoted')
    })

    it('should run a guarded block', async () => {
      const guardedFn = jest.fn()
      await permission.promote(1)

      let error = 'none'
      try {
        await permission.guard(guardedFn)
      } catch ({ message }) {
        error = message
      }

      expect(error).toBe('none')
      expect(guardedFn).toHaveBeenCalled()
    })
  })

  describe('as normal user', async () => {
    const { permission, persistenceSet, persistenceGet } = await setup(9)
    expect(persistenceGet).toHaveBeenCalled()

    it('should not allow promoting a user to superuser', async () => {
      let error = 'none'
      try {
        await permission.promote(13)
      } catch ({ message }) {
        error = message
      }
      expect(error).toBe('Permission Error: User with ID 9 is not a superuser')
      expect(persistenceSet).not.toHaveBeenCalled()
    })

    it('should not allow demoting a superuser', async () => {
      let error = 'none'
      try {
        await permission.demote(13)
      } catch ({ message }) {
        error = message
      }
      expect(error).toBe('Permission Error: User with ID 9 is not a superuser')
      expect(persistenceSet).not.toHaveBeenCalled()
    })

    it('should not run a guarded block', async () => {
      const guardedFn = jest.fn()

      let error = 'none'
      try {
        await permission.guard(guardedFn)
      } catch ({ message }) {
        error = message
      }

      expect(error).toBe('Permission Error: User with ID 9 is not a superuser')
      expect(guardedFn).not.toHaveBeenCalled()
    })
  })
})
