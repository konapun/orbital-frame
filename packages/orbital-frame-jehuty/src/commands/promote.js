export default ({ permissionService, userService }) => ({
  name: 'promote',
  description: 'Promote a user to a superuser',
  options: {
    n: {
      alias: 'name',
      describe: 'Search by name instead of ID',
      type: 'boolean',
      default: false
    }
  },
  async execute ([ search ], options) {
    const searchProp = options.name ? 'name' : 'id'

    const { id } = await userService.findOne({ [searchProp]: search })
    permissionService.promote(id)
  }
})
