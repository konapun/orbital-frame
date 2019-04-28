import commandBuilder from './commandBuilder'
import interpolationBuilder from './interpolationBuilder'
import type from '../metadata/types'

function pipelineBuilder (context) {
  const pipeline = []

  return {
    addCommand (name) {
      const builder = commandBuilder(name, context)
      pipeline.push(builder)

      return builder
    },

    addArgument (interpolation) {
      const builder = interpolationBuilder(interpolation)
      pipeline.push(builder)

      return this
    },

    getMetadata () {
      return {
        [type.PIPELINE]: pipeline.map(segment => segment.getMetadata())
      }
    },

    build (buildOpts = {}) {
      const [ first, ...rest ] = pipeline.map(segment => segment.build(buildOpts))
      const [ last ] = pipeline.slice(-1)
      const lastCommand = context.commandRegistry[last.name]
      const formatter = (buildOpts.format !== false && lastCommand) ? lastCommand.format : output => output // last command won't exist if entire pipeline is interpolations

      return async (args, opts) =>
        formatter(await rest.reduce(async (val, cmd) => await cmd(val), await first(args, opts)))
    }
  }
}

export default pipelineBuilder
