const execute = () => next => (command, context) => {
  console.log(`EXECUTING COMMAND - ${command}`)
  next('output', context)
}

export default execute
