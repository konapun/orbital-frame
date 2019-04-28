import validator from './runtimeValidator' // TODO:
import { isNil } from 'lodash'

// distribute duplicate long and short opts and distribute values
// distribute boolean opt args to arguments
// validate runtime
// TODO: this is a mess. clean it up
function wrapper (pid, cmd) {
  const options = [
    ...Object.entries(cmd.options),
    ...Object.entries(cmd.options) // include entries for aliases for consistent lookup
      .map(([ key, definition ]) => [ definition.alias, { ...definition, alias: key } ])
  ].reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

  // Check value validity and assign defaults
  const getOptionValues = (execOpts, args) => {
    return Object.entries(options)
      .map(([ key, definition ]) => {
        const value = execOpts[key] || execOpts[definition.alias] || definition.default
        const isValid = definition.valid(value, args)
        if (!isValid) {
          throw new Error(`Invalid argument for option "${key}": ${value}`)
        }

        return {
          [key]: value
        }
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  const getPromotedArgsOpts = (args, opts) => { // the distribution of arguments to options isn't known until runtime since some options can be boolean switches. Determine which option values should actually be arguments and repartition
    const booleanOpts = Object.entries(cmd.options).filter(([ , value ]) => value.type === 'boolean').reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})
    const distributedArgs = [
      ...Object.entries(opts).filter(([ key ]) => booleanOpts[key]).map(([ , val ]) => val),
      ...args
    ].filter(arg => !isNil(arg))

    const expandedBooleanOpts = [
      ...Object.entries(booleanOpts),
      ...Object.entries(booleanOpts)
        .map(([ key, value ]) => [ options[key].alias, value ])
    ].reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

    const distributedOpts = Object.entries(opts)
      .map(([ key, val ]) => expandedBooleanOpts[key] ? [ key, !!val ] : [ key, val ])
      .reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})

    return [ distributedArgs, distributedOpts ]
  }

  const executionContext = {
    ...cmd,
    pid
  }

  // TODO: Validate opts against their option definition
  return {
    async execute (args, opts) {
      return await cmd.execute.call(executionContext, ...getPromotedArgsOpts(args, getOptionValues(opts, args)))
    }
  }
}

export default wrapper
