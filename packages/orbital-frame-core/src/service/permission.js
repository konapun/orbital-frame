class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

const permission = () => ({ userService, persistenceService }) => {
  const storage = persistenceService.namespace('permission').curry('superusers')

  const rootUsersP = userService.find({ root: true }).then(users => users.map(({ id }) => id))
  const storedSuperusersP = storage.get()
  const superusersP = Promise.all([ rootUsersP, storedSuperusersP ]).then(([ rootUsers = [], storedSuperusers = [] ]) => new Set([ ...rootUsers, ...storedSuperusers ]))

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
        const rootUsers = await rootUsersP

        if (rootUsers.includes(userId)) {
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
      const { id: userId } = await userService.getCurrentUser()

      if (await this.isSuperuser(userId)) {
        return await block()
      } else {
        throw new PermissionError(`User with ID ${userId} is not a superuser`)
      }
    }
  }
}

export default permission
