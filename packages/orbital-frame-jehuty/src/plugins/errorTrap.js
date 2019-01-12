import {phase} from '@orbital-frame/core'

function errorTrapPlugin () {
  return Object.values(phase)
    .map(phaseKey => ({
      [phaseKey]: {
        error (e) {
          console.log(`Caught error ${e.message}`)
        }
      }
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

export default errorTrapPlugin
