import parser, { walker, type } from '@orbital-frame/parser'
import command, { builder } from '../command'

const compiler = () => ({ commandService, environmentService })  => ({

  /**
   * const command = compiler.compile('echo "test" | emoji-text')
   * command()
   *
   * @param {String} string source to parse into executable pipeline
   */
  compile (string) {
    const ast = parser.parse(string)
    console.log('Have ast', ast)
    const commandBuilder = builder(commandService.registry)

    const pipelines = []
    const commands = []
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
        // TODO:
        break
      }
      case type.COMMAND: {
        const [ name ] = node.body
        command = pipeline.addCommand(name)
        commands.push(command)
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
        break
      }
      }
    })

    return commandBuilder.build()
  }
})

export default compiler
