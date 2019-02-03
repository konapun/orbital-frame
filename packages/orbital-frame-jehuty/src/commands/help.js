function help ({ commandService }) {
  const listAll = () => Object.keys(commandService.registry)
  const listOne = command => {
    console.log('Listing help for command', command)
  }

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
      return Object.keys(commandService.registry)
    },
    format (output) {
      // TODO: in-depth help
    }
  }
}

export default help
