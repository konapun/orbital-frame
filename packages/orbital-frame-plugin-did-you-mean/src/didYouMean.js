import { phase, error } from '@orbital-frame/core'
import damerauLevenshtein from 'talisman/metrics/distance/damerau-levenshtein'

const defaults = {
  sensitivity: 2
}

const didYouMean = options => ({ commandService, messengerService }) => ({
  [phase.EXECUTE]: {
    error (e, { context }) {
      if (!(e instanceof error.CommandNotFoundError)) return
      const { sensitivity } = { ...defaults, ...options }
      const command = context.message.text.split(/\s+/).splice(1).join(' ')

      const matches = Object.keys(commandService.registry).map(name => {
        const distance = damerauLevenshtein(command, name)
        return { name, distance }
      }).filter(({ distance }) => distance <= sensitivity)

      if (matches.length > 0) {
        messengerService.respond(context, `Did you mean:\n${matches.map(({ name }) => `    ${name}`).join('\n')}`)
      }
    }
  }
})

export { didYouMean } // configurable
export default didYouMean() // use only default configuration
