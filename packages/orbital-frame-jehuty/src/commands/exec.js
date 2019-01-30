export default ({ compilerService }) => ({
  name: 'exec',
  description: 'Execute a string as a command',
  options: {},
  format (output) {
    return output // TODO:
  },
  execute (args, opts) {
    const compiled = compilerService.compile(args.join(' '))
    return compiled()
  }
})
