import commandBuilder from './commandBuilder'
import type from '../metadata/types'

function pipelineBuilder (context) {
  const commands = []

  return {
    addCommand (name) {
      const builder = commandBuilder(name, context)
      commands.push(builder)

      return builder
    },

    addArgument (interpolation) {
      commands.push({
        build: () => interpolation
      })

      return this
    },

    getMetadata () {
      return {
        [type.COMMAND]: commands.map(command => command.getMetadata())
      }
    },

    build () {
      const [ first, ...rest ] = commands.map(command => command.build())
      const [ last ] = commands.slice(-1)
      const formatter = context.commandRegistry[last.name].format

      return async (args, opts) =>
        formatter(await rest.reduce(async (val, cmd) => await cmd(val), await first(args, opts)))
    }
  }
}

export default pipelineBuilder
