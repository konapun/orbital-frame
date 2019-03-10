export default () => ({
  name: 'get',
  description: 'Retrieve data at a position from a list',
  options: {
    i: {
      alias: 'index',
      describe: 'index',
      type: 'number',
      required: true,
      valid: (value, args) => value > 0 && value < args.length
    }
  },
  execute (args, { index }) {
    return args[index]
  }
})
