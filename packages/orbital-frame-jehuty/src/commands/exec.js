export default ({ compilerService }) => ({
  name: 'exec',
  synopsis: 'exec [COMMAND STRING]',
  description: 'Execute a string as a command',
  execute (args) {
    const compiled = compilerService.compile(args.join(' '))
    return compiled()
  }
})
