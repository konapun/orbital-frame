import { isFunction, flatten } from 'lodash'
import runtimeValidator from './runtimeValidator'

function builder (commandRegistry, environment) {
  // const commandValidator = runtimeValidator(commandRegistry)
  const pipelines = []
  const assignments = []

  function pipelineBuilder (commandRegistry) {
    const commands = []

    return {
      addCommand (name) {
        const builder = commandBuilder(name, commandRegistry)
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

  function commandBuilder (name, commandRegistry) {
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

        const getPromotedArgsOpts = (args, opts, optsDefinition) => { // the distribution of arguments to options isn't known until runtime since some options can be boolean switches. Determine which option values should actually be arguments and repartition
          const validOptions = { // flatten options and aliases for O(1) lookup
            ...optsDefinition,
            ...Object.values(optsDefinition).map(definition => ({ [definition.alias]: definition })).reduce((acc, curr) => ({ ...acc, curr }))
          }

          const redistOpts = Object.entries(opts).forEach(([ key, value ]) => {
            const schema = validOptions[key]

            console.log(`Schema for option ${key}`, schema)
          })

          // TODO:
          return [ args, opts ]
        }

        // TODO: execute can be async
        return incoming => {
          const execArgs = incoming ? [ incoming, ...args ] : args
          const interpolatedArgs = flatten(execArgs.map(arg => isFunction(arg) ? arg() : arg)) // TODO: await this as well
          const execOptions = options
            .map(opt => opt.build())
            .map(([ key, value ]) => isFunction(value) ? [ key, value() ] : [ key, value ]) // TODO: await this as well
            .reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

          console.log('OPTIONS DEFINITION:', command.options)
          console.log('EXEC OPTIONS:', execOptions)
          return command.execute(...getPromotedArgsOpts(interpolatedArgs, execOptions, command.options))
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

export default builder
