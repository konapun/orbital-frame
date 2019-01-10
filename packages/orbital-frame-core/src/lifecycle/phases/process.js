const process = ({ parserService }) => next => context => {
  const message = context.message.text.split(/\s+/).splice(1).join(' ')
  const command = parserService.parse(message)

  console.log('Process::message:', message)
  console.log('Process::command:', command)

  next(command, context)
}

export default process
