export default () => ({
  name: 'channel',
  description: 'Get channel information',
  options: {
    l: {
      alias: 'list',
      describe: 'list channels',
      type: 'boolean'
    },
    n: {
      alias: 'number',
      describe: 'test',
      type: 'number',
      default: 2
    }
  },
  execute () {
    // TODO:
  }
})
