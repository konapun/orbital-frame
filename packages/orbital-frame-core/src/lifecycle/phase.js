
function phase (fn) {
  const listeners = {
    before: [],
    after: [],
    error: []
  }

  return {
    call: services => next => (...args) => {
      const nextWrapper = (...args) => {
        listeners.after.forEach(listener => listener(...args))
        return next(...args)
      }

      const action = fn(services)(nextWrapper)

      listeners.before.forEach(listener => listener(...args))

      try {
        action(...args)
      } catch (err) {
        listeners.error.forEach(listener => listener(err))
      }
    },

    listen ({enter, exit, error} = {enter: null, exit: null, error: null}) {
      if (enter) {
        listeners.before.push(enter)
      }
      if (exit) {
        listeners.after.push(exit)
      }
      if (error) {
        listeners.error.push(error)
      }
    }
  }
}

export default phase
