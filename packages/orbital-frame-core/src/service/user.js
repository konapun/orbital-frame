import search from '../util/search'

const user = frame => ({ configService, jobService, environmentService }) => {
  const list = async () => (await frame.getUsers()).map(user => ({ ...user, root: user.name === configService.name || frame.rootUsers.includes(user.id) }))
  const { find, findOne } = search(list)

  return {
    async getCurrentUser (full = false) {
      const pid = environmentService.get('!')
      const { userId }  = await jobService.findOne({ 'command.pid': pid })

      const liteProjection = { id: userId }
      return full ? this.findOne(liteProjection) : liteProjection
    },

    find,
    findOne,
    list
  }
}

export default user
