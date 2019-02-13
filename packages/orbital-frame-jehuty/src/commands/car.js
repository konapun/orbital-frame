function car () {
  return {
    name: 'car',
    description: 'TODO',
    execute (args) {
      console.log('Have args', args)
      return args[0]
    }
  }
}

export default car
