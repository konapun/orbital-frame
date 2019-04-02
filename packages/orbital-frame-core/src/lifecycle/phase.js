function phase (fn) {
  const extensions = {
    before: [],
    after: [],
    error: []
  }

  return {
    call: services => next => async (...args) => {
      const nextWrapper = (...args) => {
        extensions.after.forEach(extension => extension(...args)) // TODO: can extensions can be async?
        return next(...args)
      }

      try {
        const action = fn(services)(nextWrapper)
        extensions.before.forEach(extension => extension(...args)) // TODO: can extensions can be async?
        await action(...args)
      } catch (err) {
        const errorHandlers = extensions.error
        if (errorHandlers.length === 0) {
          throw err // don't silently swallow errors if no custom handlers are available
        } else {
          errorHandlers.forEach(extension => extension(err, ...args)) // TODO: can extensions can be async?
        }
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
