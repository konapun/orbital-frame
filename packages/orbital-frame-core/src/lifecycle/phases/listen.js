const cycleState = () => {
  const state = {}
  return {
    set (key, value) {
      state[key] = value
    },
    get (key) {
      return state[key]
    }
  }
}

const listen = ({ configService, listenerService }) => next => () => {
  listenerService.listen(configService.name).pipe(context => {
    next({ context, state: cycleState() })
  })
}

export default listen

