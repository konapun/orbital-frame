function equal () {
  return {
    name: 'equal',
    synopsis: 'equal [VALUE1] [VALUE2] ...[VALUES]',
    description: 'Check two or more arguments for equality',
    options: {
      s: {
        alias: 'strict',
        description: 'Use strict equality (=== instead of ==)',
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
