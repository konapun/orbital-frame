export default () => ({
  name: 'less-than',
  description: 'Check whether one number is less than another',
  options: {
    e: {
      describe: 'Compare less than or equal to',
      alias: 'or-equal',
      type: 'boolean'
    }
  },
  execute (args, opts) {
    if (args.length !== 2) throw new Error('Wrong number of arguments')
    const [ n1, n2 ] = args
    if (opts.e) {
      return n1 <= n2
    }
    return n1 < n2
  }
})
