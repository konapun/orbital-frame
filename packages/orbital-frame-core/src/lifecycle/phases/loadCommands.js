const registerCommands = ({ configService, commandService }) => next => () => {
  const commands = configService.commands
  commandService.load(commands)
  next()
}

export default registerCommands
