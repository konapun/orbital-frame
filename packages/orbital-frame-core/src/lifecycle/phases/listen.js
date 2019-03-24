import state from '../../util/state'

const listen = ({ configService, listenerService }) => next => () => {
  listenerService.listen(configService.name).pipe(context => {
    next({ context, state: state() }) // each downstream phase will share state
  })
}

export default listen

