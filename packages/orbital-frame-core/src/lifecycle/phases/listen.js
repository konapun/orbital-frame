import state from '../../util/state'
import { escapeRegExp } from 'lodash'

const listen = ({ configService, listenerService }) => next => args => {
  const hail = `${configService.ps1}${configService.name}`
  const matcher = new RegExp(`^${escapeRegExp(hail)}\\s`)

  listenerService.listen(matcher).pipe(context => {
    next({ ...args, context, state: state() }) // each downstream phase will share state
  })
}

export default listen

