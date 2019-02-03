import { phase } from '@orbital-frame/core'

/**
 * Set up environment variables
 */
function plugin ({ configService, environmentService }) {
  return {
    [phase.LOAD_PLUGINS]: {
      exit () {
        const env = {
          NAME: configService.name,
          ADAPTER: 'slack'
        }

        Object.entries(env).forEach(([ key, value ]) => environmentService.set(key, value))
      }
    }
  }
}

export default plugin
