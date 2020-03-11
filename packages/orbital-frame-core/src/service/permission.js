class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

// TODO: allow inner fn to be async
const permission = () => ({ jobService, environmentService, persistenceService }) => {
  const storage = persistenceService.namespace('permission').curry('superusers')
  const superusers = new Set([ 0, ...storage.get() ]) // // since only other superusers can add more superusers, make ID 0 the only default superuser // TODO: get superuser from userService when ready
  // TODO: await above!

  return {
    PermissionError,

    async promote (userId) {
      return this.guard(() => {
        superusers.add(userId)
        storage.set(Array.from(superusers))
      })
    },

    async demote (userId) {
      return this.guard(() => {
        if (userId === 0) {
          throw new Error('Root user cannot be demoted')
        }

        const didDelete = superusers.delete(userId)
        storage.set(Array.from(superusers))
        return didDelete
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
  }
}

export default permission
