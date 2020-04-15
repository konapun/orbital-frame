export default () => ({
  name: 'get',
  synopsis: 'get [ITEM] ...[ITEMS]',
  description: 'Retrieve data at a position from a list',
  options: {
    i: {
      alias: 'index',
      description: 'index',
      type: 'number',
      required: true,
      valid: (value, args) => value > 0 && value < args.length
    }
  },
  execute (args, { index }) {
    return args[index]
  }
})
