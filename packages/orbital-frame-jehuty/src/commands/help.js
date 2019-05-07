function help ({ commandService }) {
  const listAll = () => Object.keys(commandService.registry)
  const listOne = command => commandService.registry[command].description

  return {
    name: 'help',
    description: 'List all available commands',
    execute (args) {
      switch (args.length) {
      case 0:
        return listAll()
      case 1:
        return listOne(args[0])
      default:
        throw new Error('Wrong number of arguments: expected 0 or 1')
      }
    },
    format (output) {
      // TODO:
      return `
Available Commands
------------------
${output.join('\n')}
`
    }
  }
}

export default help
