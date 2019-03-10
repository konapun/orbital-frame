function echo () {
  return {
    name: 'echo',
    description: 'Write arguments to standard output',
    format (output) {
      return `Formatted: ${output}`
    },
    execute (args) {
      return args.join(' ')
    }
  }
}

export default echo
