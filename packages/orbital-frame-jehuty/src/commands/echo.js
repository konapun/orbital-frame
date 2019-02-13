function echo () {
  return {
    name: 'echo',
    description: 'TODO',
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
