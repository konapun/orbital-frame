/**
 * The process phase processes the command line input and builds a command
 * pipeline to be executed in the next step
 */
const process = ({ compilerService }) => next => context => {
  const message = context.message.text.split(/\s+/).splice(1).join(' ')
  const command = compilerService.compile(message)

  next(command, context)
}

export default process
