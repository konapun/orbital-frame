const execute = () => next => args => {
  const { command } = args
  const output = command()
  next({ ...args, output })
}

export default execute
