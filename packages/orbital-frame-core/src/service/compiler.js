import parser, { walker, type } from '@orbital-frame/parser'
import { builder } from '../command'

const compiler = () => ({ commandService, environmentService })  => ({

  /**
   * Create a function from a source string
   *
   * @param {String} string source to parse into executable pipeline
   * @returns {Function} function that when executed evaluates the source string
   */
  compile (string) { // TODO: pass compile options for formatting or something? use this to assign an id to a command on execute?
    const ast = parser.parse(string)
    return this.buildCommand(ast)
  },

  buildCommand (ast) {
    const commandBuilder = builder(commandService.registry, environmentService)

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
        const [ key ] = node.body

        const assignment = commandBuilder.addVariable(key)
        currentBuilder = assignment
        break
      }
      case type.INTERPOLATION: {
        const [ source ] = node.body
        const cmd = this.buildCommand(source)
        currentBuilder.addArgument(cmd)
        return walker.treeControl.SUBTREE_STOP // subtree processing is handled by the recursive call of buildCommand
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
        if (currentBuilder) {
          currentBuilder.addArgument(value)
        }
        currentBuilder = command
        break
      }
      case type.VARIABLE: {
        const [ key ] = node.body
        currentBuilder.addVariable(key)
        break
      }
      }
    })

    return commandBuilder.build()
  }
})

export default compiler
