export default ({ compilerService }) => ({
  name: 'xargs',
  description: 'Distribute list items to a command',
  execute ([ source, ...list ]) {
    const command = compilerService.compile(source)

    return Promise.all(list.map(async arg => command(arg, {})))
  }
})
