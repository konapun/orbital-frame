import {lifecyclePhase as phase} from '@orbital-frame/core'

function plugin () {
  return {
    [phase.START]: {
      enter () {
        console.log('Starting')
      },
      exit () {
        console.log('Started')
      }
    },
    [phase.REGISTER_PLUGINS]: {
      enter () {
        console.log('Registering plugins')
      },
      exit () {
        console.log('Registered plugins')
      }
    },
    [phase.REGISTER_COMMANDS]: {
      enter () {
        console.log('Registering commands')
      },
      exit () {
        console.log('Registered commands')
      }
    },
    [phase.LISTEN]: {
      enter () {
        console.log('Listening')
      },
      exit () {
        console.log('Listened')
      }
    },
    [phase.PROCESS]: {
      enter () {
        console.log('Processing')
      },
      exit () {
        console.log('Processed')
      }
    },
    [phase.EXECUTE]: {
      enter () {
        console.log('Executing')
      },
      exit () {
        console.log('Executed')
      }
    },
    [phase.RESPOND]: {
      enter () {
        console.log('Responding')
      },
      exit () {
        console.log('Responded')
      }
    },
    [phase.ERROR]: {
      enter () {
        console.log('Triggering error')
      },
      exit () {
        console.log('Triggered error')
      }
    }
  }
}

export default plugin
