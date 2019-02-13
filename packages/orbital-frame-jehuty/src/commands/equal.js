function equal () {
  return {
    name: 'equal',
    description: 'Check two or more arguments for equality',
    options: {
      strict: {
        alias: 's',
        type: 'boolean',
        default: false
      }
    },
    execute ([ first, ...rest ], opts) {
      const compare = opts.strict ? (a, b) => a === b : (a, b) => a == b
      return rest.every(value => compare(value, first))
    }
  }
}

export default equal
