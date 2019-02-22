import { isFunction, flatten } from 'lodash'
import runtimeValidator from './runtimeValidator'

function builder (commandRegistry, environment) {
  const pipelines = []
  const assignments = []

  function pipelineBuilder () {
    const commands = []

    return {
      addCommand (name) {
        const builder = commandBuilder(name)
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
        return async () => await rest.reduce(async (val, cmd) => await cmd(val), await first())
      }
    }
  }

  function commandBuilder (name) {
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

        // TODO: validate options
        const validateOptions = (opts, schema) => {
          const validOptions = { // flatten options and aliases for O(1) lookup
            ...optsDefinition,
            ...Object.values(optsDefinition).map(definition => ({ [definition.alias]: definition })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
          }

          // const redistOpts = Object.entries(opts).forEach(([ key, value ]) => {
          //   const schema = validOptions[key]
          //   console.log('Schema:', schema)
          //   const validator = runtimeValidator(schema)
          //   const something = validator.validate(value)

          //   console.log('Got validator output', something)
          //   console.log(`Schema for option ${key}`, schema)
          // })
        }

        const getPromotedArgsOpts = (args, opts, optsDefinition = {}) => { // the distribution of arguments to options isn't known until runtime since some options can be boolean switches. Determine which option values should actually be arguments and repartition
          const validOptions = { // flatten options and aliases for O(1) lookup
            ...optsDefinition,
            ...Object.values(optsDefinition).map(definition => ({ [definition.alias]: definition })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
          }

          const booleanOpts = Object.entries(validOptions).filter(([ , value ]) => value.type === 'boolean').reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})
          const distributedArgs = [ ...args, ...Object.entries(opts).filter(([ key ]) => booleanOpts[key]).map(([ , val ]) => val) ]
          const distributedOpts = Object.entries(opts).map(([ key, val ]) => booleanOpts[key] ? { [key]: true } : { [key]: val }).reduce((acc, curr) => ({ ...acc, ...curr }), {})
          return [ distributedArgs, distributedOpts ]
        }

        return async incoming => {
          const execArgs = incoming ? [ incoming, ...args ] : args
          const interpolatedArgs = flatten(await Promise.all(execArgs.map(async arg => isFunction(arg) ? await arg() : arg)))
          const execOptionsP = await Promise.all(
            options
              .map(opt => opt.build())
              .map(async ([ key, value ]) => isFunction(value) ? [ key, await value() ] : [ key, value ])
          )
          const execOptions = execOptionsP.reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

          return await command.execute(...getPromotedArgsOpts(interpolatedArgs, execOptions, command.options))
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
      const builder = pipelineBuilder()
      pipelines.push(builder)

      return builder
    },

    addVariable (key) {
      const builder = assignmentBuilder(key)
      assignments.push(builder)

      return builder
    },

    build () {
      return async () => {
        await Promise.all(assignments
          .map(assignment => assignment.build())
          .map(async ([ key, value ]) => {
            const execVal = isFunction(value) ? await value() : value
            environment.set(key, execVal)
          })
        )

        return await Promise.all(pipelines.map(async pipeline => {
          const pipelineOutput = pipeline.build()
          return await pipelineOutput()
        }))
      }
    }
  }
}

export default builder
