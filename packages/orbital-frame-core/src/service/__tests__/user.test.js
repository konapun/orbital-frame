import userService from '../user'

const frame = {
  getUsers: jest.fn()
}

describe('user service', () => {
  const user = userService(frame)()

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
})
