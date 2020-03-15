export default ({ permissionService, userService }) => ({
  name: 'promote',
  description: 'Promote a user to a superuser',
  async execute ([ name ]) {
    const { id } = await userService.findOne({ name })
    permissionService.promote(id)
  }
})
