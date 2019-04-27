const loadCommands = ({ configService, commandService }) => next => args => {
  const commands = configService.commands
  commandService.load(commands)
  next(args)
}

export default loadCommands
