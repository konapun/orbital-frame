const execute = () => next => (command, context) => {
  const output = command()
  console.log('OUTPUT:', output)
  next(output, context)
}

export default execute
