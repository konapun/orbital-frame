function echo () {
  return {
    name: 'echo',
    description: 'TODO',
    options: {
      t: {
        alias: 'test',
        describe: 'Testing',
        type: 'number',
        required: false,
        default: 1
      },
      v: {
        alias: 'test2',
        describe: 'Boolean test',
        type: 'boolean'
      },
      w: {
        alias: 'test3',
        describe: 'Boolean test2',
        type: 'boolean'
      },
      x: {
        alias: 'test4',
        describe: 'Boolean test3',
        type: 'boolean'
      }
    },
    format (output) {
      return `Formatted: ${output}`
    },
    execute (args, opts) {
      // console.log('THIS', this)
      // console.log('Echo got options', opts)
      // console.log('Echo got args', args)
      return args.join(' ')
    }
  }
}

export default echo
