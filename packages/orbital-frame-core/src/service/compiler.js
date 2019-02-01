import parser, { walker, type } from '@orbital-frame/parser'
import command, { builder } from '../command'

const compiler = () => ({ commandService })  => ({

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
      console.log(`Walking: on node ${node.type}`)
      switch (node.type) {

      case type.PIPELINE: {
        console.log('ADDING PIPELINE')
        pipeline = commandBuilder.addPipeline()
        pipelines.push(pipeline)
        break
      }
      case type.COMMAND: {
        command = pipeline.addCommand()
        commands.push(command)
        break
      }
      case type.REDIRECT: {
        break
      }
      case type.OPTION: {
        const [ key, value ] = type.body
        command.addOption(key, value)
        break
      }
      case type.ARGUMENT: {
        const [ value ] = type.body
        command.addArgument(value)
        break
      }
      case type.VARIABLE: {
        break
      }

      }
    })

    return commandBuilder.build()
  }
})

export default compiler
