import { phase } from '@orbital-frame/core'
import policy from './policy'

const noop = () => {}

export default (policies = []) => () => {
  console.log('Got policies', policies)
  const applyPolicies = message => policies.map(({ type, constraints = [], default: unknown = policy.REJECT, onFail = noop }) => {

  })

  return {
    [phase.LISTEN]: {
      exit ({ context }) {
        const { message } = context
        const { user, channel, text } = message
        const command = text.split(/\s+/).splice(1).join(' ')

        applyPolicies({ user, channel, command })
      }
    }
  }
}
