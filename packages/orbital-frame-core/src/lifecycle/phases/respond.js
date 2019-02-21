const respond = ({ messengerService }) => next => args => {
  const { context, output } = args
  const response = output.join('\n')
  messengerService.respond(context, response) // FIXME: context stuff for commands
  next({ ...args, response })
}

export default respond
