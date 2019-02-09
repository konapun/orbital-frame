import parser, { walker, type } from '@orbital-frame/parser'
import { builder } from '../command'

const compiler = () => ({ commandService, environmentService })  => ({

  /**
   * Create a function from a source string
   *
   * @param {String} string source to parse into executable pipeline
   * @returns {Function} function that when executed evaluates the source string
   */
  compile (string) {
    const ast = parser.parse(string)
    return this.buildCommand(ast)
  },

  buildCommand (ast) {
    const commandBuilder = builder(commandService.registry)

    const pipelines = []
    let pipeline, command, option
    walker.walk(ast, node => {
      switch (node.type) {

      case type.PIPELINE: {
        pipeline = commandBuilder.addPipeline()
        pipelines.push(pipeline)
        break
      }
      case type.ASSIGNMENT: {
        const [ key, value ] = node.body
        console.log('Env setting', key, 'to', value)
        environmentService.set(key, value)
        break
      }
      case type.INTERPOLATION: {
        const [ source ] = node.body
        pipeline.addInterpolated(source)
        // TODO: probably want to evaluate interpolation on command execute, not build, so remove stuff below once this is working in the builder
        const cmd = this.buildCommand(source)
        console.log(`Source ${source} evaluated to ${cmd()}`)
        return cmd()
      }
      case type.COMMAND: {
        const [ name ] = node.body
        command = pipeline.addCommand(name)
        break
      }
      case type.OPTION: {
        const [ key ] = node.body
        option = command.addOption(key)
        break
      }
      case type.ARGUMENT: {
        const [ value ] = node.body
        if (option) {
          try {
            option.setValue(value)
          } catch (err) { // option already has value
            command.addArgument(value)
          }
        } else {
          command.addArgument(value)
        }
        break
      }
      case type.VARIABLE: { // FIXME: this should return up to its parent (switch compiler to use post-order tree traversa)
        const [ key ] = node.body
        const value = environmentService.get(key)
        command.addArgument(value) // FIXME: might be option
        console.log('Got value', value)
        // TODO:
        return value
        break
      }
      }
    })

    return commandBuilder.build()
  }
})

export default compiler
