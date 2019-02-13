function not () {
  return {
    name: 'not',
    description: 'TODO',
    execute ([ value ]) {
      return !value
    }
  }
}

export default not
