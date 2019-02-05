function echo () {
  return {
    name: 'echo',
    description: 'TODO',
    format (output) {
      return `Formatted: ${output}`
    },
    execute (args) {
      console.log('Echoing args', args)
      return args.join(' ')
    }
  }
}

export default echo
