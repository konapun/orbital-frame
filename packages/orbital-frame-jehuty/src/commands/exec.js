export default ({ compilerService }) => ({
  name: 'exec',
  description: 'Execute a string as a command',
  options: {},
  format (output) {
    return output // TODO:
  },
  execute (args) {
    const compiled = compilerService.compile(args.join(' '))
    return compiled()
  }
})
