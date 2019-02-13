import { phase } from '@orbital-frame/core'
import sudo from './sudo.command'

function plugin ({ commandService }) { // TODO: gonna need user service
  return {
    [phase.LOAD_PLUGINS]: {
      exit () {
        // TODO: set up user accounts

        commandService.load(sudo)
      }
    }
  }
}

export default plugin
