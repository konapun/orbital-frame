const respond = ({ messengerService }) => next => (output, context) => {
  messengerService.respond(context, output)
  next()
}

export default respond
