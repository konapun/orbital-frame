import { phase } from '@orbital-frame/core'

export default ({ environmentService }) => ({
  [phase.LOAD_PLUGINS]: {
    exit () {
      environmentService.set('SESSION_START', Date.now(), true)
    }
  }
})
