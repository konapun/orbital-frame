console.log('building registry')
const commandRegistry = {}

const loadOne = (command, services) => {
  const commandDefinition = command(services)
  commandRegistry[commandDefinition.name] = commandDefinition
}

const commandService = () => (services) => ({
  get registry () {
    return { ...commandRegistry }
  },
  load (commands) {
    [].concat(commands)
      .forEach(command => loadOne(command, services))
  }
})

export default commandService
