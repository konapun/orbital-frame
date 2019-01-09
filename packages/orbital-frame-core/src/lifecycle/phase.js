
function phase (fn) {
  const listeners = {
    before: [],
    after: [],
    error: []
  }

  return {
    call: services => next => (...args) => {
      listeners.before.forEach(listener => listener(...args))
      try {
        fn(services)(next)(...args) // FIXME: probably wanna trigger before/after here
      } catch (err) {
        listeners.error.forEach(listener => listener(err))
      }
      listeners.after.forEach(listener => listener()) // TODO: pass result that `next` is invoked with
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
