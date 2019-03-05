function alias ({ commandService, compilerService }) {
  return {
    name: 'alias',
    description: 'Create an alias for a command string',
    execute ([ name, source ]) {
      const { command, metadata } = compilerService.compileWithMetadata(source)
      const firstCommandName = metadata.pipelines[0].commands[0].name // TODO: add nicer way to walk this
      const firstCommand = commandService.registry[firstCommandName]

      commandService.load(() => ({
        name,
        options: firstCommand.options,
        description: `Alias for "${source}"`,
        execute (args, opts) {
          return command(args, opts)
        }
      }))
    }
  }
}

export default alias
