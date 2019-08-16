export default () => ({
  name: 'tail',
  description: 'Return items from the end of input',
  options: {
    n: {
      alias: 'number',
      type: 'number',
      describe: 'Number of entries from the end of input to show',
      valid: (value, args) => value > 0 && value < args.length,
      default: 1
    }
  },
  execute (args, { number }) {
    return args.reverse().slice(0, number).reverse()
  }
})

