export default () => ({
  name: 'join',
  synopsis: 'join [ITEM] [...ITEMS]',
  description: 'Join input by a character',
  options: {
    g: {
      alias: 'glue',
      description: 'Text to join the input with',
      type: 'string',
      default: ' '
    }
  },
  execute (args, opts) {
    return args.join(opts.g)
  }
})
