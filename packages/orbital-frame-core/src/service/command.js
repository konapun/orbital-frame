import { schemaValidator } from '../command'
const commandRegistry = {}

const loadOne = (command, services) => {
  const commandDefinition = command(services)
  const { value, error } = schemaValidator.validate(commandDefinition)
  if (error) {
    throw Error(error)
  }
  commandRegistry[commandDefinition.name] = value
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
