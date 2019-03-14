function alias ({ commandService, compilerService }) {
  return {
    name: 'alias',
    description: 'Create an alias for a command string',
    execute ([ name, source ]) {
      const { command, metadata } = compilerService.compileWithMetadata(source)
      const firstCommandName = metadata.findOne(({ type }) => type === metadata.type.COMMAND).name
      const firstCommand = commandService.registry[firstCommandName]

      commandService.load(() => ({
        name,
        options: firstCommand.options,
        description: `Alias for "${source}"`,
        execute (args, opts) {
          // console.log('EXECUTE WITH ARGS', args) // FIXME: args are being prepended to the beginning?
          return command(args, opts)
        }
      }))
    }
  }
}

export default alias
