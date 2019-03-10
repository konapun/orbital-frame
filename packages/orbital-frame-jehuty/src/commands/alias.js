function alias ({ commandService, compilerService }) {
  return {
    name: 'alias',
    description: 'Create an alias for a command string',
    execute ([ name, source ]) {
      const { command, metadata } = compilerService.compileWithMetadata(source)
      const firstCommandName = metadata.data.pipelines[0].commands[0].name // TODO: add nicer way to walk this
      const firstCommand = commandService.registry[firstCommandName]
      const test = metadata.findOne(({ type, value }) => {
        console.log('ON TYPE', type, 'WITH VALUE', value)
        return type === metadata.type.COMMAND
      })
      // console.log('FOUND TEST', test)

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
