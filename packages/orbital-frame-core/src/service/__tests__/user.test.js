import userService from '../user'

const frame = {
  rootUsers: [ 3 ],
  getUsers: jest.fn(() => Promise.resolve([ { id: 0, name: 'jehuty' }, { id: 1, name: 'anubis' }, { id: 3, name: 'configRoot' } ]))
}
const configService = {
  name: 'jehuty'
}
const jobService = {
  findOne: jest.fn(() => ({ userId: 1, command: { pid: 1 } }))
}
const environmentService = {
  get: jest.fn(() => 1)
}

describe('user service', () => {
  const user = userService(frame)({ configService, jobService, environmentService })

  it('should map the root property', async () => {
    const users = await user.list()
    expect(users).toEqual([ { id: 0, name: 'jehuty', root: true }, { id: 1, name: 'anubis', root: false }, { id: 3, name: 'configRoot', root: true } ])
  })

  it('should list users', async () => {
    await user.list()
    expect(frame.getUsers).toHaveBeenCalled()
  })

  it('should support finding users', () => {
    expect(user.find).toBeDefined()
  })

  it('should support finding a single user', () => {
    expect(user.findOne).toBeDefined()
  })

  describe('getCurrentUser', () => {
    user.findOne = jest.fn(user.findOne)

    it('should get the light projection by default', async () => {
      const currentUser = await user.getCurrentUser()

      expect(environmentService.get).toHaveBeenCalledWith('!')
      expect(jobService.findOne).toHaveBeenCalledWith({ 'command.pid': 1 })
      expect(user.findOne).not.toHaveBeenCalled()
      expect(currentUser).toEqual({ id: 1 })
    })

    it('should get the full projection if requested', async () => {
      const currentUser = await user.getCurrentUser(true)

      expect(environmentService.get).toHaveBeenCalledWith('!')
      expect(jobService.findOne).toHaveBeenCalledWith({ 'command.pid': 1 })
      expect(user.findOne).toHaveBeenCalledWith({ id: 1 })
      expect(currentUser).toEqual({ id: 1, name: 'anubis', root: false })
    })
  })
})
