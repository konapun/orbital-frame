function not () {
  return {
    name: 'not',
    synopsis: 'not [VALUE]',
    description: 'Get the logical inversion of a value',
    execute ([ value ]) {
      return !value
    }
  }
}

export default not
