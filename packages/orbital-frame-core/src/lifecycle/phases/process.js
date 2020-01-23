/**
 * The process phase processes the command line input and builds a command
 * pipeline to be executed in the next step
 */
const process = ({ compilerService }) => next => args => {
  const { context } = args
  const source = context.message.text.split(/\s+/).splice(1).join(' ')
  const { command, metadata } = compilerService.compileWithMetadata(source)

  next({ ...args, source, command, metadata })
}

export default process
