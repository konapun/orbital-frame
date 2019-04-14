import optionBuilder from './optionBuilder'
import type from '../metadata/types'
import commandWrapper from '../wrapper'
import { isFunction, flatten } from 'lodash'

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
      return this.addArgument(() => environment.get(key))
    },

    getMetadata () {
      return {
        name,
        [type.OPTION]: options.map(option => option.getMetadata()).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        [type.ARGUMENT]: args.map(arg => arg.getMetadata ? arg.getMetadata() : arg)
      }
    },

    build () {
      const command = commandRegistry[name]
      if (!command) {
        throw new Error(`Command not found: ${name}`)
      }

      const wrapper = commandWrapper(pid, command)
      return async (incoming, opts = {}) => {
        const execArgs = incoming ? [ incoming, ...args ] : args
        const interpolatedArgs = flatten(await Promise.all(execArgs.map(async arg => isFunction(arg) ? await arg() : arg)))
        const execOptionsP = await Promise.all(
          options
            .map(opt => opt.build())
            .map(async ([ key, value ]) => isFunction(value) ? [ key, await value() ] : [ key, value ])
        )
        const execOptions = execOptionsP.reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

        return await wrapper.execute(interpolatedArgs, { ...opts, ...execOptions })
      }
    }
  }
}

export default commandBuilder
