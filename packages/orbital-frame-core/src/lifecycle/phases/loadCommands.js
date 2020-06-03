const loadCommands = ({ configService, commandService }) => next => async args => {
  const commands = [ ...configService.commands ]
  await commandService.load(commands)
  next(args)
}

export default loadCommands
