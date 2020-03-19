export default () => ({
  name: 'split',
  description: 'Split input by a character',
  options: {
    d: {
      alias: 'delimiter',
      describe: 'Text to split the input by',
      type: 'string',
      default: ' '
    }
  },
  execute: args => args.join(' ').split(' ')
})
