const registerCommands = ({configService, memoryService}) => next => () => {
  console.log('REGISTERING COMMANDS - TODO')
  const commands = configService.commands
  // TODO: register commands
  next()
}

export default registerCommands
