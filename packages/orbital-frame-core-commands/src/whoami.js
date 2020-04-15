function whoami ({ userService }) {
  return {
    name: 'whoami',
    synopsis: 'whoami',
    description: 'Get the current user',
    format (user) {
      return user.name
    },
    async execute () {
      return userService.getCurrentUser()
    }
  }
}

export default whoami
