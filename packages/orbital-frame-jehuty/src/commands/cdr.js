function cdr () {
  return {
    name: 'cdr',
    description: 'TODO',
    execute ([ car, ...rest ]) {
      return rest
    }
  }
}

export default cdr
