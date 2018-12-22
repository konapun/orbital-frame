const execute = () => next => command => {
  console.log(`EXECUTING COMMAND - ${command}`)
  next('output')
}

export default execute
