function assignmentBuilder (variable) {
  let value

  return {
    addArgument (val) {
      value = val
    },

    getMetadata () {
      return { variable, value }
    },

    build () {
      return [ variable, value ]
    }
  }
}

export default assignmentBuilder
