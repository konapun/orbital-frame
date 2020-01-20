import state from '../../util/state'

const listen = ({ configService, listenerService }) => next => args => {
  const matcher = new RegExp(`^${configService.ps1}${configService.name}\\s`)

  listenerService.listen(matcher).pipe(context => {
    next({ ...args, context, state: state() }) // each downstream phase will share state
  })
}

export default listen

