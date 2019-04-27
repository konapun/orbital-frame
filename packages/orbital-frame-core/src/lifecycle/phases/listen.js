import state from '../../util/state'

const listen = ({ configService, listenerService }) => next => args => {
  listenerService.listen(configService.name).pipe(context => {
    next({ ...args, context, state: state() }) // each downstream phase will share state
  })
}

export default listen

