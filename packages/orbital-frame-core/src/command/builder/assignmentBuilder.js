import type from '../metadata/types'

function assignmentBuilder (variable, scope, { environment }) {
  let value

  return {
    addArgument (val) {
      value = () => val
    },

    addVariable (key) { // setting the value from another variable
      value = () => environment.get(key, { opts: scope })
    },

    getMetadata () {
      return {
        [type.ASSIGNMENT]: {
          variable,
          scope,
          value: value()
        }
      }
    },

    build () {
      return [ variable, scope, value() ]
    }
  }
}

export default assignmentBuilder
