export default () => ({
  name: 'greater-than',
  synopsis: 'greater-than [NUMBER1] [NUMBER2]',
  description: 'Check whether one number is greater than another',
  options: {
    e: {
      description: 'Compare greater than or equal to',
      alias: 'or-equal',
      type: 'boolean'
    }
  },
  execute (args, opts) {
    if (args.length !== 2) throw new Error('Wrong number of arguments')
    const [ n1, n2 ] = args
    if (opts.e) {
      return n1 >= n2
    }
    return n1 > n2
  }
})
