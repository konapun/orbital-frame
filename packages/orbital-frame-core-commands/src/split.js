export default () => ({
  name: 'split',
  synopsis: 'split [INPUT] ...[REST]',
  description: 'Split input by a character',
  options: {
    d: {
      alias: 'delimiter',
      description: 'Text to split the input by',
      type: 'string',
      default: ' '
    }
  },
  execute: (args, opts) => args.join(' ').split(opts.d)
})
