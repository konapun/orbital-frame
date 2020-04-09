export default () => ({
  name: 'head',
  synopsis: 'head [ITEM] ...[ITEMS]',
  description: 'Return items from the front of input',
  options: {
    n: {
      alias: 'number',
      type: 'number',
      description: 'Number of entries from the beginning of input to show',
      valid: (value, args) => value > 0 && value < args.length,
      default: 1
    }
  },
  execute (args, { number }) {
    return args.slice(0, number)
  }
})

