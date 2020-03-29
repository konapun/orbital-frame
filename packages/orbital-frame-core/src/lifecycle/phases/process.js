/**
 * The process phase processes the command line input and builds a command
 * pipeline to be executed in the next step
 */
const process = ({ compilerService, configService }) => next => args => {
  const { context } = args

  const name = configService.name
  const input = context.message.text
  const source = input.substring(input.indexOf(name) + name.length + 1) // remove bot hail portion from command

  const { command, metadata } = compilerService.compileWithMetadata(source)

  next({ ...args, source, command, metadata })
}

export default process
