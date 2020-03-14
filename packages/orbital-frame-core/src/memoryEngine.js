function memoryEngine () {
  const memory = {}

  return {
    async get (key) {
      return memory[key]
    },

    async set (key, value)  {
      memory[key] = value
    }
  }
}

export default memoryEngine
