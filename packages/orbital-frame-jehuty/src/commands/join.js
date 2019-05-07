export default () => ({
  name: 'join',
  description: 'Join input by a character',
  options: {
    g: {
      alias: 'glue',
      describe: 'Text to join the input with',
      type: 'string',
      default: ' '
    }
  },
  execute (args, opts) {
    return args.join(opts.g)
  }
})
