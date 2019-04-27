import { phase } from '@orbital-frame/core'

function errorTrapPlugin ({ messengerService }) {
  return Object.values(phase)
    .map(phaseKey => ({
      [phaseKey]: {
        error (e, { context }) {
          const message = `Error: ${e.message}`

          if (context) {
            messengerService.respond(context, `\`${message}\``)
          } else {
            throw e // error happened outside of main runloop
          }
        }
      }
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

export default errorTrapPlugin
