const superusers = new Set([ 0 ]) // since only other superusers can add more superusers, make ID 0 the only default superuser // TODO: Get this from Persistence once persistenceService is ready

class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

const permission = () => ({ jobService, environmentService }) => ({
  PermissionError,

  async promote (userId) {
    return this.guard(() => {
      superusers.add(userId)
    })
  },

  async demote (userId) {
    return this.guard(() => {
      return superusers.delete(userId)
    })
  },

  isSuperuser (userId) {
    return superusers.has(userId)
  },

  async guard (block) {
    const pid = environmentService.get('!')
    const { userId } = await jobService.findOne({ 'command.pid': pid })

    if (this.isSuperuser(userId)) {
      return block()
    } else {
      throw new PermissionError(`User with ID ${userId} is not a superuser`)
    }
  }
})

export default permission
