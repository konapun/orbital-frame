export default () => ({
  name: 'flatten',
  synopsis: 'flatten [ITEM] ...[ITEMS]',
  description: 'Flatten array data to a string',
  execute: args => args.join(' ')
})
