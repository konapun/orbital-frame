import { look, examine, move } from './actions'

function player (user, location) {
  const properties = {
    location
  }

  const actions = {}

  const base = {
    load (action) {
      if (action.verbs) {
        const { execute } = action
        action.verbs.forEach(verb => actions[verb] = execute)
      }
    }
  }

  const proxy = new Proxy(base, {
    get (target, property) {
      if (base[property]) return base[property]
      if (actions[property]) {
        return actions[property].bind(proxy)
      }
      return properties[property]
    }
  })

  proxy.load(move)
  proxy.load(look)
  proxy.load(examine)

  return proxy
}

export default player
