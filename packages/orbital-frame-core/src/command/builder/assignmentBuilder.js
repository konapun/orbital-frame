import type from '../metadata/types'

function assignmentBuilder (variable) {
  let value

  return {
    addArgument (val) {
      value = val
    },

    getMetadata () {
      return {
        [type.ASSIGNMENT]: {
          variable,
          value
        }
      }
    },

    build () {
      return [ variable, value ]
    }
  }
}

export default assignmentBuilder