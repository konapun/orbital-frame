import parser, { walker, type } from '@orbital-frame/parser'
import { builder, metadataWalker } from '../command'
import { ParseError } from '../error'

const compiler = () => ({ commandService, environmentService })  => ({

  /**
   * Create a function from a source string
   *
   * @param {String} string source to parse into executable pipeline
   * @returns {Function} function that when executed evaluates the source string
   */
  compile (string) {
    const ast = this._parse(string)
    const builder = this._getBuilder(ast)
    return builder.build()
  },

  compileWithMetadata (string) {
    const ast = this._parse(string)
    const builder = this._getBuilder(ast)
    const metadata = metadataWalker(builder.getMetadata())
    const command = builder.build()

    return { metadata, command }
  },

  _parse (string) {
    try {
      return parser.parse(string)
    } catch (err) {
      throw new ParseError(err)
    }
  },

  _getBuilder (ast, options = {}) {
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
        const [ key, scope ] = node.body

        const assignment = commandBuilder.addVariable(key, scope)
        currentBuilder = assignment
        break
      }
      case type.INTERPOLATION: {
        const [ source ] = node.body

        const cmd = this._getBuilder(source, options).build({ ...options, format: false }) // if interpolation is within a scope it should have access to scoped variables //FIXME: passing options both places is kind of ugly
        currentBuilder.addArgument(cmd)
        return walker.treeControl.SUBTREE_STOP // subtree processing is handled by the recursive call of _getBuilder
      }
      case type.FUNCTION: {
        const [ name, body ] = node.body

        const fnOpts = { scope: name }
        const cmd = this._getBuilder(body, fnOpts).build(fnOpts)
        const execute = () => cmd() // swallow args and opts since functions get these through env variables
        commandService.load(() => ({ name, execute }))
        return walker.treeControl.SUBTREE_STOP // subtree processing is handled by the recursive call of _getBuilder
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

    return commandBuilder
  }
})

export default compiler
