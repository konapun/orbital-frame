import _ from 'lodash'

export default () => ({
  name: 'repeat',
  synopsis: 'repeat [TEXT] ...[REST]',
  description: 'Repeat output',
  options: {
    r: {
      alias: 'repeat',
      description: 'Number of times to repeat',
      type: 'number',
      default: 2
    }
  },
  execute (args, { repeat }) {
    return _.range(0, repeat).reduce(acc => [ ...acc, ...args ], [])
  }
})
