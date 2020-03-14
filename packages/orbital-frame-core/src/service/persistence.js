const persistence = ({ storageEngine }) => () => {
  return {
    async get (key) {
      return storageEngine.get(key)
    },

    async set (key, value) {
      return storageEngine.set(key, value)
    },

    curry (key) {
      return {
        async get () {
          return storageEngine.get(key)
        },

        async set (value) {
          return storageEngine.set(key, value)
        }
      }
    },

    namespace (ns) {
      const namespaceKey = key => `${ns}.${key}`

      const namespace = {
        async get (key) {
          return storageEngine.get(namespaceKey(key))
        },

        async set (key, value) {
          return storageEngine.set(namespaceKey(key), value)
        }
      }

      return {
        ...namespace,

        async get (key) {
          return storageEngine.get(namespaceKey(key))
        },

        async set (key, value) {
          return storageEngine.set(namespaceKey(key), value)
        },

        curry (key) {
          return {
            async get () {
              return storageEngine.get(namespaceKey(key))
            },

            async set (value) {
              return storageEngine.set(namespaceKey(key), value)
            }
          }
        }
      }
    }
  }
}

export default persistence
