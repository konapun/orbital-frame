import { phase } from '@orbital-frame/core'
import { NAMESPACE } from './consts'

export default ({ listenerService, messengerService, persistenceService }) => ({
  [phase.LOAD_PLUGINS]: {
    exit () {
      listenerService.listen(/.+/).pipe(context => {
        messengerService.respond(context, 'got it!')
        console.log('GOT MESSAGE', context.message)
      })
    }
  }
})
