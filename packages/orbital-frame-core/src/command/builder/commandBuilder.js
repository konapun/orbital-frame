import optionBuilder from './optionBuilder'
import type from '../metadata/types'
import commandWrapper from '../runtimeWrapper'
import { CommandNotFoundError } from '../../error'
import { isFunction, isArray, flatten } from 'lodash'

function commandBuilder (name, context) {
  const { environment, commandRegistry, pid } = context
  const options = []
  const args = []

  return {
    name,

    addOption (key) {
      const option = optionBuilder(key, context)
      options.push(option)

      return option
    },

    addArgument (argument) {
      args.push(argument)
      return this
    },

    addVariable (key) {
      return this.addArgument((_, buildOpts) => environment.get(key, { scope: buildOpts?.scope }))
    },

    getMetadata () {
      return {
        [type.COMMAND]: {
          name,
          options: options.map(option => option.getMetadata()).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          arguments: args.map(arg => arg.getMetadata ? arg.getMetadata() : (isFunction(arg) ? arg() : arg ))
        }
      }
    },

    build (buildOpts = {}) {
      const command = commandRegistry[name]
      if (!command) {
        throw new CommandNotFoundError(`Command not found: ${name}`)
      }

      const wrapper = commandWrapper(pid, command)
      return async (incoming, opts = {}) => {
        const execArgs = incoming ? [ ...args, incoming ] : args
        const interpolatedArgs = flatten(await Promise.all(execArgs.map(async arg => {
          if (isFunction(arg)) {
            const value = await arg(undefined, buildOpts)
            return isArray(value) ? flatten(value) : value
          }
          return arg
        })))
        const execOptionsP = await Promise.all(
          options
            .map(opt => opt.build(buildOpts))
            .map(async ([ key, value ]) => isFunction(value) ? [ key, await value() ] : [ key, value ])
        )
        const execOptions = execOptionsP.reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

        return await wrapper.execute(interpolatedArgs, { ...opts, ...execOptions })
      }
    }
  }
}

export default commandBuilder
