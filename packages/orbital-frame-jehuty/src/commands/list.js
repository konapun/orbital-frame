export default () => ({
  name: 'list',
  description: 'Convert args to a list',
  execute (args) {
    return [ args ]
  }
})
