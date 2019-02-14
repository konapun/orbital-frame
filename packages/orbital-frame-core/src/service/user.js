const user = frame => () => ({
  async find (criteria) { // ex: find({ name: 'konapun' })
    const matcher = user => Object.entries(criteria).every(([ key, value ]) => user[key] === value)
    const allUsers = await this.list()

    return allUsers.filter(matcher)
  },

  async findOne (criteria) {
    const matches = await this.find(criteria)
    return matches[0]
  },

  async list () {
    return await frame.getUsers()
  }
})

export default user
