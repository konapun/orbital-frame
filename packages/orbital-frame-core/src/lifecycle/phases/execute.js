const execute = () => next => async args => {
  const { command } = args
  const output = await command()
  next({ ...args, output })
}

export default execute
