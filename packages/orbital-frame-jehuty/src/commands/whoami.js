function whoami ({ userService }) {
  return {
    name: 'whoami',
    description: 'TODO',
    format (user) {
      return user.name
    },
    async execute () {
      return userService.getCurrentUser()
    }
  }
}

export default whoami
