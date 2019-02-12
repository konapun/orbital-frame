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
    let pipeline, command, option, currentBuilder
    walker.walk(ast, node => {
      switch (node.type) {

      case type.PIPELINE: {
        pipeline = commandBuilder.addPipeline()
        pipelines.push(pipeline)
        currentBuilder = pipeline
        break
      }
      case type.ASSIGNMENT: {
        const [ key, value ] = node.body
        console.log('Env setting', key, 'to', value)
        environmentService.set(key, value) // FIXME: value could be an interpolation so assignments need to happen at runtime; move to builder
        break
      }
      case type.INTERPOLATION: {
        const [ source ] = node.body
        const cmd = this.buildCommand(source)
        currentBuilder.addArgument(cmd)
      }
      case type.COMMAND: {
        const [ name ] = node.body
        command = pipeline.addCommand(name)
        currentBuilder = command
        break
      }
      case type.OPTION: {
        const [ key ] = node.body
        option = command.addOption(key)
        currentBuilder = option
        break
      }
      case type.ARGUMENT: {
        const [ value ] = node.body
        currentBuilder.addArgument(value)
        break
      }
      case type.VARIABLE: {
        const [ key ] = node.body
        const value = environmentService.get(key) // FIXME: this should happen at runtime, not compile
        currentBuilder.addArgument(value)
        break
      }
      }
    })

    return commandBuilder.build()
  }
})

export default compiler
