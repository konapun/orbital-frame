const respond = ({ messengerService }) => next => (output, context) => {
  const response = output.join('\n')
  messengerService.respond(context, response) // FIXME: context stuff for commands
  next()
}

export default respond
