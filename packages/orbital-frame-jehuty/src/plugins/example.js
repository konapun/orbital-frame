import {phase} from '@orbital-frame/core'

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
    [phase.LOAD_PLUGINS]: {
      enter () {
        console.log('Loading plugins')
      },
      exit () {
        console.log('Loaded plugins')
      }
    },
    [phase.LOAD_COMMANDS]: {
      enter () {
        console.log('Loading commands')
      },
      exit () {
        console.log('Loaded commands')
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
    }
  }
}

export default plugin
