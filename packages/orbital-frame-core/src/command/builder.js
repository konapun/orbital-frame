import { isFunction, flatten } from 'lodash'

function builder (commandRegistry, environment) { // TODO: use environment
  const pipelines = []
  const assignments = []

  return {
    addPipeline () {
      const builder = pipelineBuilder(commandRegistry, environment)
      pipelines.push(builder)

      return builder
    },
    addVariable (key) {
      const builder = assignmentBuilder(key)
      assignments.push(builder)

      return builder
    },
    build () {
      return () => {
        assignments
          .map(assignment => assignment.build())
          .map(([ key, value ]) => {
            const execVal = isFunction(value) ? value() : value // TODO: async
            environment.set(key, execVal)
          })

        return pipelines.map(pipeline => { // TODO: await pipelines
          const pipelineOutput = pipeline.build()
          return pipelineOutput()
        })
      }
    }
  }
}

function pipelineBuilder (commandRegistry, environment) {
  const commands = []

  return {
    addCommand (name) {
      const builder = commandBuilder(name, commandRegistry, environment)
      commands.push(builder)

      return builder
    },

    addArgument (interpolation) {
      commands.push({
        build: () => interpolation
      })

      return this
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
      const option = optionBuilder(key, environment)
      options.push(option)

      return option
    },

    addArgument (argument) {
      args.push(argument)
      return this
    },

    addVariable (key) {
      this.addArgument(() => environment.get(key))
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

        // TODO: need to parse options schema from command definition to find out how to distribute args from opts in case of binary and also provide early error messages from unrecognized options
        return command.execute(interpolatedArgs, execOptions)
      }
    }
  }
}

function optionBuilder (key, environment) {
  let optionValue

  return {
    setValue (value) {
      if (optionValue) throw new Error('Options may only have a single value')
      optionValue = value
    },

    addArgument (value) {
      this.setValue(value)
    },

    addVariable (key) {
      this.addArgument(() => environment.get(key))
    },

    build () {
      return [ key, optionValue ]
    }
  }
}

function assignmentBuilder (variable) {
  let value

  return {
    addArgument (val) {
      value = val
    },

    build () {
      return [ variable, value ]
    }
  }
}

export default builder
