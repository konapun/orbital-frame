import { schemaValidator, wrapper } from '../command'
import { ValidationError, PermissionError } from '../error'

const commandRegistry = {}

const loadOne = async (command, services) => {
  const commandDefinition = wrapper(command(services))
  const { value, error } = schemaValidator.validate(commandDefinition)
  if (error) {
    throw new ValidationError(error)
  }

  // TODO: only allow root users to overwrite commands
  const { permissionService } = services
  const commandName = commandDefinition.name
  if (commandRegistry[commandName]) {
    const isSuperuser = await permissionService.isSuperuser()
    if (!isSuperuser) {
      throw new PermissionError(`A command "${commandName}" already exists - only superusers can redefine commands`)
    }
  }
  commandRegistry[commandName] = value
}

const commandService = () => services => ({
  get registry () {
    return { ...commandRegistry }
  },
  async load (commands) {
    return Promise.all(
      [].concat(commands)
        .map(command => loadOne(command, services))
    )
  }
})

export default commandService
