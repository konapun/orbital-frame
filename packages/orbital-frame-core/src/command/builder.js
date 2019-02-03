function builder (commandRegistry) {
  const pipelines = []

  return {
    addPipeline () {
      const builder = pipelineBuilder(commandRegistry)
      pipelines.push(builder)

      return builder
    },
    build () {
      // return pipelines.map(pipeline => pipeline.build())

      return () => {
        console.log('EXECUTING!')
        return pipelines.map(pipeline => {
          const pipelineOutput = pipeline.build()
          console.log('OUTPUT:', pipelineOutput())
          return pipelineOutput()
        })
      }
    }
  }
}

function pipelineBuilder (commandRegistry) {
  const commands = []

  return {
    addCommand (name) {
      const builder = commandBuilder(name, commandRegistry)
      commands.push(builder)

      return builder
    },

    build () {
      const [ first, ...rest ] = commands.map(command => command.build())
      return () => rest.reduce((val, cmd) => cmd(val), first())
    }
  }
}

function commandBuilder (name, commandRegistry) {
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
      const command = commandRegistry[name]
      if (!command) {
        throw new Error(`Command not found: ${name}`)
      }

      return incoming => {
        const execArgs = incoming ? [ incoming, ...args ] : args
        return command.execute(execArgs, options)
      }
    }
  }
}

export default builder
