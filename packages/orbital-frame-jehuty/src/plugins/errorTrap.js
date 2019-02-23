import { phase } from '@orbital-frame/core'

function errorTrapPlugin ({ messengerService }) {
  return Object.values(phase)
    .map(phaseKey => ({
      [phaseKey]: {
        error (e, { context }) {
          const message = `Error: ${e.message}`

          messengerService.respond(context, `\`${message}\``)
          // throw message
        }
      }
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

export default errorTrapPlugin
