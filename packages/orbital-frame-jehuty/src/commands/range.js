import _ from 'lodash'

export default () => ({
  name: 'range',
  description: 'Generate an inclusive range',
  execute (args) {
    if (args.length !== 2) {
      throw new Error('Range must specify start and end')
    }

    const start = +args[0]
    const end = +args[1]
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new Error('Range start and end must be integers')
    }

    const offset = end >= start ? 1 : -1

    return _.range(start, end + offset)
  }
})
