import permissionService from '../permission'

const setup = (userId = 0) => {
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

  const permission = permissionService()({ jobService, environmentService })
  return { permission }
}

describe('permission service', () => {
  describe('as superuser', () => {
    const { permission } = setup(0)
    it('should allow promoting a user to superuser', async () => {
      await permission.promote(13)
      expect(permission.isSuperuser(13)).toBe(true)
    })

    it('should allow demoting a superuser', async () => {
      await permission.demote(1)
      expect(permission.isSuperuser(1)).toBe(false)
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

  describe('as normal user', () => {
    const { permission } = setup(9)

    it('should not allow promoting a user to superuser', async () => {
      let error = 'none'
      try {
        await permission.promote(13)
      } catch ({ message }) {
        error = message
      }
      expect(error).toBe('Permission Error')
    })

    it('should not allow demoting a superuser', async () => {
      let error = 'none'
      try {
        await permission.demote(13)
      } catch ({ message }) {
        error = message
      }
      expect(error).toBe('Permission Error')
    })

    it('should not run a guarded block', async () => {
      const guardedFn = jest.fn()

      let error = 'none'
      try {
        await permission.guard(guardedFn)
      } catch ({ message }) {
        error = message
      }

      expect(error).toBe('Permission Error')
      expect(guardedFn).not.toHaveBeenCalled()
    })
  })
})
