class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

const permission = () => ({ jobService, environmentService, persistenceService }) => {
  const storage = persistenceService.namespace('permission').curry('superusers')
  const superusersP = storage.get().then((storedSuperusers = []) => new Set([ 0, ...storedSuperusers ])) // since only other superusers can add more superusers, make ID 0 the only default superuser // TODO: get superuser from userService when ready

  return {
    PermissionError,

    async promote (userId) {
      return this.guard(async () => {
        const superusers = await superusersP

        superusers.add(userId)
        storage.set(Array.from(superusers))
      })
    },

    async demote (userId) {
      return this.guard(async () => {
        const superusers = await superusersP
        if (userId === 0) {
          throw new Error('Root user cannot be demoted')
        }

        const didDelete = superusers.delete(userId)
        await storage.set(Array.from(superusers))
        return didDelete
      })
    },

    async isSuperuser (userId) {
      const superusers = await superusersP

      return superusers.has(userId)
    },

    async guard (block) {
      const pid = environmentService.get('!')
      const { userId } = await jobService.findOne({ 'command.pid': pid })

      if (await this.isSuperuser(userId)) {
        return await block()
      } else {
        throw new PermissionError(`User with ID ${userId} is not a superuser`)
      }
    }
  }
}

export default permission
