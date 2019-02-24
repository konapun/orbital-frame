import { isFunction, flatten } from 'lodash'
import commandWrapper from './wrapper'

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
        const [ last ] = commands.slice(-1)
        const formatter = commandRegistry[last.name].format
        return async args => formatter(await rest.reduce(async (val, cmd) => await cmd(val), await first(args)))
      }
    }
  }

  function commandBuilder (name) {
    const options = []
    const args = []

    return {
      name,

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

        const wrapper = commandWrapper(command)
        return async incoming => {
          const execArgs = incoming ? [ incoming, ...args ] : args
          const interpolatedArgs = flatten(await Promise.all(execArgs.map(async arg => isFunction(arg) ? await arg() : arg)))
          const execOptionsP = await Promise.all(
            options
              .map(opt => opt.build())
              .map(async ([ key, value ]) => isFunction(value) ? [ key, await value() ] : [ key, value ])
          )
          const execOptions = execOptionsP.reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

          return await wrapper.execute(interpolatedArgs, execOptions)
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
      return async args => {
        await Promise.all(assignments
          .map(assignment => assignment.build())
          .map(async ([ key, value ]) => {
            const execVal = isFunction(value) ? await value() : value
            environment.set(key, execVal)
          })
        )

        return await Promise.all(pipelines.map(async pipeline => {
          const pipelineOutput = pipeline.build()
          return await pipelineOutput(args)
        }))
      }
    }
  }
}

export default builder
