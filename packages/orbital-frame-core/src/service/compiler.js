import parser, { walker, type } from '@orbital-frame/parser'
import { builder } from '../command'

const compiler = () => ({ commandService, environmentService })  => ({

  /**
   * const command = compiler.compile('echo "test" | emoji-text')
   * command()
   *
   * @param {String} string source to parse into executable pipeline
   */
  compile (string) {
    const ast = parser.parse(string)
    return this.buildCommand(ast)
  },

  buildCommand (ast) {
    const commandBuilder = builder(commandService.registry)

    const pipelines = []
    let pipeline, command
    walker.walk(ast, node => {
      switch (node.type) {

      case type.PIPELINE: {
        pipeline = commandBuilder.addPipeline()
        pipelines.push(pipeline)
        break
      }
      case type.ASSIGNMENT: {
        const [ key, value ] = node.body
        environmentService.set(key, value)
        break
      }
      case type.INTERPOLATION: {
        const [ source ] = node.body
        const cmd = this.buildCommand(source)
        console.log(`Source ${source} evaluated to ${cmd()}`)
        return cmd() // TODO: probably want to evaluate interpolation on command execute, not build
      }
      case type.COMMAND: {
        const [ name ] = node.body
        command = pipeline.addCommand(name)
        break
      }
      case type.OPTION: {
        const [ key, value ] = node.body
        command.addOption(key, value)
        break
      }
      case type.ARGUMENT: {
        const [ value ] = node.body
        command.addArgument(value)
        break
      }
      case type.VARIABLE: {
        const [ key ] = node.body
        const value = environmentService.get(key)
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
