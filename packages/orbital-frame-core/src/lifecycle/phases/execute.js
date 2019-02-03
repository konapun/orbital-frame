const execute = () => next => (command, context) => {
  const output = command()
  next(output, context)
}

export default execute
