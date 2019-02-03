const execute = () => next => (command, context) => {
  const output = command().join('\n')
  next(output, context)
}

export default execute
