function echo () {
  return {
    name: 'echo',
    description: 'TODO',
    options: {
      t: {
        alias: 'test',
        describe: 'Testing',
        type: 'boolean',
        required: false,
        default: false
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
