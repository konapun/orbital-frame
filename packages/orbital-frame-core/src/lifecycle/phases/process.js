/**
 * The process phase processes the command line input and builds a command
 * pipeline to be executed in the next step
 */
const process = ({ parserService, commandService }) => next => context => {
  const commandRegistry = commandService.registry
  const message = context.message.text.split(/\s+/).splice(1).join(' ')
  const command = parserService.parse(message)

  next(command, context)
}

export default process
