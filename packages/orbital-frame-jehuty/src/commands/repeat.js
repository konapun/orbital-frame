import _ from 'lodash'

export default () => ({
  name: 'repeat',
  description: 'Repeat output',
  options: {
    r: {
      alias: 'repeat',
      describe: 'Number of times to repeat',
      type: 'number',
      default: 1
    }
  },
  execute (args, { repeat }) {
    return _.range(0, repeat).reduce(acc => [ ...acc, ...args ], [])
  }
})
