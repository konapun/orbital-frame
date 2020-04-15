export default () => ({
  name: 'list',
  synopsis: 'list [ITEM] ...[ITEMS]',
  description: 'Convert arguments to a list',
  execute (args) {
    return [ args ]
  }
})
