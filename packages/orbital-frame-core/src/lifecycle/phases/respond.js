const respond = ({ messengerService }) => next => (output, context) => {
  messengerService.respond(context, 'RESPONDING!')
  next()
}

export default respond
