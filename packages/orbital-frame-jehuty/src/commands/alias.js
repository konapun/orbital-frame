function alias ({ commandService, compilerService }) {
  return {
    name: 'alias',
    description: 'Create an alias for a command string',
    execute ([ name, command ]) {
      const compiled = compilerService.compile(command)

      commandService.load(() => ({
        name,
        description: `Alias for "${command}"`,
        execute: (args, opts) => compiled(args, opts) // FIXME: compiled can't take args and opts yet
      }))
    }
  }
}

export default alias
