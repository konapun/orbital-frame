import { phase } from '@orbital-frame/core'

function errorTrapPlugin ({ messengerService }) {
  return Object.values(phase)
    .map(phaseKey => ({
      [phaseKey]: {
        error (e) {
          const message = `Error: ${e.message}`

          console.error(message)
          throw message
          // messengerService.respond(`\`${message}\``) // FIXME: need context...
        }
      }
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

export default errorTrapPlugin
