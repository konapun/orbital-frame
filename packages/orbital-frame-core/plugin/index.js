import FatalError from './FatalError'

export const ON_INIT = 'onInit'
export const ON_ERROR = 'onError'
export const ON_RESPOND = 'onRespond'
export const ON_EXECUTE = 'onExecute'
export const ON_SEND = 'onSend'
export const AFTER_SEND = 'afterSend'

const signals = [ ON_INIT, ON_ERROR, ON_RESPOND, ON_EXECUTE, ON_SEND, AFTER_SEND ]
const registry = []

const plugin = {
  register (bot, definition) {
    registry.push(definition.call(definition, bot))
  },

  registerMultiple (bot, definitions) {
    definitions.forEach(definition => this.register(bot, definition))
  },

  emit (signal, args, opts) {
    if (!Array.isArray(args)) args = [args]
    opts = Object.assign({}, {
      catchable: true
    }, opts)

    let continueExecution = true
    if (signals.includes(signal)) {
      let catchable = opts.catchable

      registry.some(plugin => {
        if (plugin[signal]) {
          let status = true
          if (catchable) {
            try {
              status = plugin[signal].apply(plugin, args)
            } catch (e) {
              if (e.isFatal) status = false
              this.emit(this.ON_ERROR, e)
            }
          } else {
            status = plugin[signal].apply(plugin, args)
          }

          continueExecution = status !== false // early exit
        }

        return !continueExecution
      })
    }

    return continueExecution
  }
}

export { FatalError }
export default plugin
