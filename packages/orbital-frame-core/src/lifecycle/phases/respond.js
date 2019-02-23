const respond = ({ messengerService }) => next => args => {
  const { context, output } = args
  const response = output.join('\n')
  messengerService.respond(context, response)
  next({ ...args, response })
}

export default respond
