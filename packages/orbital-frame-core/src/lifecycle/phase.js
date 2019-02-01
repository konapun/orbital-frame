
function phase (fn) {
  const extensions = {
    before: [],
    after: [],
    error: []
  }

  return {
    call: services => next => (...args) => {
      const nextWrapper = (...args) => {
        extensions.after.forEach(extension => extension(...args))
        return next(...args)
      }

      const action = fn(services)(nextWrapper)

      extensions.before.forEach(extension => extension(...args))

      try {
        action(...args)
      } catch (err) {
        extensions.error.forEach(extension => extension(err))
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
