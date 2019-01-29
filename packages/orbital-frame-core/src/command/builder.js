import command from './command'

function builder () {
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

    }
  }
}

export default builder
