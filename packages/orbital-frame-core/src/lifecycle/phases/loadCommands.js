import coreCommands from '../../commands'

const loadCommands = ({ configService, commandService }) => next => args => {
  const commands = [ ...coreCommands, ...configService.commands ]
  commandService.load(commands)
  next(args)
}

export default loadCommands
