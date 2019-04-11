function optionBuilder (key, context) {
  let optionValue

  return {
    setValue (value) {
      if (optionValue) throw new Error('Options may only have a single value')
      optionValue = value
    },

    addArgument (value) {
      this.setValue(value)
    },

    addVariable (key) {
      this.addArgument(() => context.environment.get(key))
    },

    getMetadata () {
      return { [key]: optionValue }
    },

    build () {
      return [ key, optionValue ]
    }
  }
}

export default optionBuilder
