import type from '../metadata/types'

function assignmentBuilder (variable, scope) {
  let value

  return {
    addArgument (val) {
      value = val
    },

    getMetadata () {
      return {
        [type.ASSIGNMENT]: {
          variable,
          scope,
          value
        }
      }
    },

    build () {
      return [ variable, scope, value ]
    }
  }
}

export default assignmentBuilder
