import validator from './runtimeValidator'

// distribute duplicate long and short opts and distribute values
// distribute boolean opt args to arguments
// validate runtime
function command (cmd) {
  const getOptionValues = execOpts => {
    const options = cmd.options
    const spreadOptions = {
      ...options,
      ...Object.entries(options)
        .map(([ key, definition ]) => ({ [definition.alias]: { ...definition, alias: key } }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }

    return Object.entries(spreadOptions)
      .map(([ key, definition ]) => ({
        [key]: execOpts[key] || execOpts[definition.alias] || definition.default
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }))
  }

  const getPromotedArgsOpts = (args, opts) => { // the distribution of arguments to options isn't known until runtime since some options can be boolean switches. Determine which option values should actually be arguments and repartition
    const booleanOpts = Object.entries(cmd.options).filter(([ , value ]) => value.type === 'boolean').reduce((acc, [ key, val ]) => ({ ...acc, [key]: val }), {})
    const distributedArgs = [
      ...Object.entries(opts).filter(([ key ]) => booleanOpts[key]).map(([ , val ]) => val),
      ...args
    ].filter(arg => arg)
    const distributedOpts = Object.entries(opts).map(([ key, val ]) => booleanOpts[key] ? { [key]: !!val } : { [key]: val }).reduce((acc, curr) => ({ ...acc, ...curr }), {})

    return [ distributedArgs, distributedOpts ]
  }

  // TODO: Validate opts against their option definition
  return {
    async execute (args, opts) {
      return await cmd.execute(...getPromotedArgsOpts(args, getOptionValues(opts)))
    }
  }
}

export default command
