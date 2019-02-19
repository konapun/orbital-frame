const channel = frame => () => ({
  async find (criteria) { // ex: find({ name: 'general' })
    const matcher = channel => Object.entries(criteria).every(([ key, value ]) => channel[key] === value)
    const allChannels = await this.list()

    return allChannels.filter(matcher)
  },

  async findOne (criteria) {
    const matches = await this.find(criteria)
    if (matches.length === 0) {
      throw new Error('No channels found for search criteria')
    }

    return matches[0]
  },

  async list () {
    return await frame.getChannels()
  }
})

export default channel
