import { isFunction, flatten } from 'lodash'

function builder (commandRegistry) {
  const pipelines = []

  return {
    addPipeline () {
      const builder = pipelineBuilder(commandRegistry)
      pipelines.push(builder)

      return builder
    },
    build () {
      return () => pipelines.map(pipeline => { // TODO: await pipelines
        const pipelineOutput = pipeline.build()
        return pipelineOutput()
      })
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
      return () => rest.reduce((val, cmd) => cmd(val), first()) // TODO: async
    }
  }
}

function commandBuilder (name, commandRegistry, environment) {
  const options = []
  const args = []

  return {
    addOption (key) {
      const option = optionBuilder(key)
      options.push(option)

      return option
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

      // TODO: execute can be async
      return incoming => {
        const execArgs = incoming ? [ incoming, ...args ] : args
        const interpolatedArgs = flatten(execArgs.map(arg => isFunction(arg) ? arg() : arg)) // TODO: await this as well
        const execOptions = options
          .map(opt => opt.build())
          .map(([ key, value ]) => isFunction(value) ? [ key, value() ] : [ key, value ]) // TODO: await this as well
          .reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

        return command.execute(interpolatedArgs, execOptions)
      }
    }
  }
}

function optionBuilder (key) {
  let optionValue

  return {
    setValue (value) {
      if (optionValue) throw new Error('Options may only have a single value')
      optionValue = value
    },

    addArgument (value) {
      this.setValue(value)
    },

    build () {
      return [ key, optionValue ]
    }
  }
}

export default builder
