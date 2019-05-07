export default ({ commandService }) => ({
  name: 'xargs',
  description: 'Distribute list items to a command',
  execute ([ commandName, ...list ]) {
    const command = commandService.registry[commandName]

    return Promise.all(list.map(arg => command.execute(arg, {})))
  }
})
