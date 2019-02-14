
function phase (fn) {
  const extensions = {
    before: [],
    after: [],
    error: []
  }

  return {
    call: services => next => (...args) => {
      const nextWrapper = (...args) => {
        extensions.after.forEach(extension => extension(...args)) // TODO: extensions can be async
        return next(...args)
      }

      const action = fn(services)(nextWrapper)

      extensions.before.forEach(extension => extension(...args)) // TODO: extensions can be async

      try {
        action(...args) // TODO: actions can be async
      } catch (err) {
        extensions.error.forEach(extension => extension(err)) // TODO: extensions can be async
      }
    },

    extend ({ enter, exit, error } = { enter: null, exit: null, error: null }) {
      if (enter) {
        extensions.before.push(enter)
      }
      if (exit) {
        extensions.after.push(exit)
      }
      if (error) {
        extensions.error.push(error)
      }
    }
  }
}

export default phase
