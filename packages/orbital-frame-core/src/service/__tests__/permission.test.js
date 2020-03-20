import permissionService from '../permission'

const setup = (userId = 0, overrides = {}) => {
  const settings = {
    get: [],
    root: [ 0 ],
    userId,
    ...overrides
  }

  const userService = {
    find: jest.fn(() => Promise.resolve([ { id: 0 } ])),
    getCurrentUser: jest.fn(() => ({ id: userId }))
  }

  const persistenceSet = jest.fn(() => Promise.resolve())
  const persistenceGet = jest.fn(() => Promise.resolve(settings.get))
  const persistenceService = {
    namespace: () => ({
      curry: () => ({
        get: persistenceGet,
        set: persistenceSet
      })
    })
  }

  const permission = permissionService()({ userService, persistenceService })
  return { permission, userService, persistenceSet, persistenceGet }
}

describe('permission service', () => {
  it('should initialize from persistence', async () => {
    const { permission, persistenceGet } = setup(4, { get: [ 1, 2, 3 ], root: [ 0 ] })

    expect(persistenceGet).toHaveBeenCalled()
    expect(await permission.isSuperuser(0)).toBe(true)
    expect(await permission.isSuperuser(1)).toBe(true)
    expect(await permission.isSuperuser(2)).toBe(true)
    expect(await permission.isSuperuser(3)).toBe(true)
    expect(await permission.isSuperuser(4)).toBe(false)
  })

  describe('as superuser', async () => {
    const { permission, persistenceSet, persistenceGet } = setup(1, { get: [ 1 ] })
    expect(persistenceGet).toHaveBeenCalled()

    it('should allow promoting a user to superuser', async () => {
      await permission.promote(13)

      expect(await permission.isSuperuser(13)).toBe(true)
      expect(persistenceSet).toHaveBeenCalledWith([ 0, 1, 13 ])
    })

    it('should allow demoting a superuser', async () => {
      const demoted = await permission.demote(13)

      expect(await permission.isSuperuser(13)).toBe(false)
      expect(demoted).toBeTrue()
      expect(persistenceSet).toHaveBeenCalledWith([ 0, 1 ])
    })

    it('should not allow the root user to be demoted', async () => {
      let error = 'none'
      try {
        await permission.demote(0)
      } catch ({ message }) {
        error = message
      }

      expect(error).toBe('Permission Error: Root user cannot be demoted')
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
    const { permission, persistenceSet, persistenceGet } = setup(9)
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
