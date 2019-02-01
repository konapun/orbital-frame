import Joi from 'joi'

const commandSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  usage: Joi.string().default(''),
  options: Joi.object().default({}),
  format: Joi.func().default(() => {}),
  execute: Joi.func().required()
})
const commandRegistry = {}

const loadOne = (command, services) => {
  const commandDefinition = command(services)
  const { error } = Joi.validate(commandDefinition, commandSchema)
  if (error) {
    throw Error(error)
  }
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
