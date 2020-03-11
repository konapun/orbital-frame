function memoryEngine () {
  const memory = {}

  return {
    get (key) {
      return memory[key]
    },

    set (key, value)  {
      memory[key] = value
    }
  }
}

export default memoryEngine
