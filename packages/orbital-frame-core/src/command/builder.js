import command from './command'

function builder (commandRegistry) {
  const pipelines = []

  return {
    addPipeline () {
      const builder = pipelineBuilder()
      pipelines.push(builder)

      return builder
    },
    build () {
      return () => {
        // return a function which is the interpreter
      }
    }
  }
}

function pipelineBuilder () {
  const commands = []

  return {
    addCommand () {
      const builder = commandBuilder()
      commands.push(builder)

      return builder
    },

    build () {
      const [ first, ...rest ] = commands
      return () => rest.reduce((pipeline, command) => pipeline.pipe(command), first)
    }
  }
}

function commandBuilder () {
  const options = {}
  const args = []

  return {
    addOption (key, value) {
      options[key] = value
      return this
    },

    addArgument (argument) {
      args.push(argument)
      return this
    },

    build () {
      // TODO: return a command
    }
  }
}

export default builder
