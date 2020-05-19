function help ({ commandService }) {
  const listAll = () => Object.keys(commandService.registry).sort()
  const listOne = commandName => {
    const command = commandService.registry[commandName]
    if (command) {
      const { name, synopsis = none, description = none, options = {} } = command

      const formatOption = ([ key, { alias, type, default: def, required = false, description: describe = none } ]) => {
        const keyDescriptor = `-${key}, --${alias}`
        const typeDescriptor = `[${[ type, def ? `:${def}` : null, required ? 'REQUIRED' : null ].filter(i => i).join(' ')}]`

        return `${keyDescriptor}\t${typeDescriptor}\t${describe}`
      }
      const optsString = Object.entries(options).map(formatOption).join('\n')

      return `
NAME
      ${name}

SYNOPSIS
      ${synopsis || none}

DESCRIPTION
      ${description || none}

OPTIONS
      ${optsString || none}
`
    }
  }

  return {
    name: 'help',
    synopsis: 'help ?[COMMAND]',
    description: 'List all available commands and help dialog for an individual command',
    execute (args) {
      switch (args.length) {
      case 0:
        return listAll()
      case 1: {
        const [ command ] = args
        const description = listOne(command)
        if (!description) {
          throw new Error(`Unknown command "${command}"`)
        }
        return listOne(args[0])
      }
      default:
        throw new Error('Wrong number of arguments: expected 0 or 1')
      }
    },
    format (output) {
      if (Array.isArray(output)) { // list all
        return [ 'Available Commands', '------------------', ...output ].join('\n')
      }

      return output
    }
  }
}

const none = '(none)'

export default help
