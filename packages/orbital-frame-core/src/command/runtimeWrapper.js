import validator from './runtimeValidator' // TODO:
import { isNil } from 'lodash'

function wrapper (pid, command) {
  const { options, execute } = command

  const spreadOpts = Object.entries(options).reduce((acc, [ key, val ]) => ({ ...acc, [key]: val, [val.alias]: { ...val, alias: key } }), {})
  const unifyOptions = rtOpts => Object.entries(rtOpts).reduce((acc, [ key, val ]) => ({ ...acc, [key]: val, [spreadOpts[key].alias]: val }), {})
  const redistributeArgsOpts = (args, opts) => {
    const [ additionalArgs, distributedOpts ] = Object.entries(opts).reduce(([ accArgs, accOpts ], [ optKey, optVal ]) => {
      if (!spreadOpts[optKey]) return [ accArgs, accOpts ]
      if (spreadOpts[optKey].type === 'boolean') {
        if (optVal) {
          accArgs = [ ...accArgs, optVal ]
        }

        accOpts = { ...accOpts, [optKey]: true }
      } else {
        accOpts = { ...accOpts, [optKey]: optVal }
      }

      return [ accArgs, accOpts ]
    }, [ [], {} ])

    const redistributedOpts = unifyOptions(distributedOpts)
    const defaults = Object.entries(spreadOpts).reduce((acc, [ optKey, optVal ]) => {
      const defaultVal = optVal.default || optVal.type === 'boolean' && false
      const deflt = !isNil(defaultVal) ? { [optKey]: defaultVal } : {}
      return { ...acc, ...deflt }
    }, {})

    return [ [ ...additionalArgs, ...args ], { ...defaults, ...redistributedOpts } ]
  }

  const executionContext = {
    ...command,
    pid
  }

  return {
    async execute (args, opts) {
      return await execute.call(executionContext, ...redistributeArgsOpts(args, opts))
    }
  }
}

export default wrapper
