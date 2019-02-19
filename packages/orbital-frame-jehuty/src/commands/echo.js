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
      }
    },
    format (output) {
      return `Formatted: ${output}`
    },
    execute (args, opts) {
      console.log('Echo got options', opts)
      return args.join(' ')
    }
  }
}

export default echo
