import { phase } from '@orbital-frame/core'

/* eslint-disable no-console */
function plugin ({ configService }) {
  return {
    [phase.LOAD_PLUGINS]: { // phases before exiting LOAD_PLUGINS aren't available for extension via plugins since they're not yet loaded
      exit () {
        console.log('Loaded plugins')
        console.log('----------')
      }
    },
    [phase.LOAD_COMMANDS]: {
      enter () {
        console.log('Loading commands')
      },
      exit () {
        console.log('Loaded commands')
        console.log('----------')
      }
    },
    [phase.LISTEN]: {
      enter () {
        console.log(`Setting up listener for "${configService.name}"...`)
      },
      exit () {
        console.log('Listened')
        console.log('----------')
      }
    },
    [phase.PROCESS]: {
      enter () {
        console.log('Processing')
      },
      exit () {
        console.log('Processed')
        console.log('----------')
      }
    },
    [phase.EXECUTE]: {
      enter () {
        console.log('Executing')
      },
      exit () {
        console.log('Executed')
        console.log('----------')
      }
    },
    [phase.RESPOND]: {
      enter () {
        console.log('Responding')
      },
      exit () {
        console.log('Responded')
        console.log('----------')
      }
    }
  }
}

export default plugin
