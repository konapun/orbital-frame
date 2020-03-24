import { schemaValidator, wrapper } from '../command'
import { ValidationError } from '../error'

const commandRegistry = {}

const loadOne = (command, services) => {
  const commandDefinition = wrapper(command(services))
  const { value, error } = schemaValidator.validate(commandDefinition)
  if (error) {
    throw new ValidationError(error)
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
