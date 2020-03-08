const superusers = new Set([ 0 ]) // since only other superusers can add more superusers, make ID 0 the only default superuser

const permission = () => ({ jobService, environmentService }) => ({
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
      throw new Error('Permission Error')
    }
  }
})

export default permission
