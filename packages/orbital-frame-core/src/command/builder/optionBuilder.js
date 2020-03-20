import type from '../metadata/types'
import { CompilationError } from '../../error'

function optionBuilder (key, context) {
  let optionValue

  return {
    setValue (value) {
      if (optionValue) throw new CompilationError('Options may only have a single value')
      optionValue = value
    },

    addArgument (value) {
      this.setValue(value)
    },

    addVariable (key) {
      this.addArgument(() => context.environment.get(key))
    },

    getMetadata () {
      return {
        [type.OPTION]: {
          key,
          value: optionValue
        }
      }
    },

    build () {
      return [ key, optionValue ]
    }
  }
}

export default optionBuilder
