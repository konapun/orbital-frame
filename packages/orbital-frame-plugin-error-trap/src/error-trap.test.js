import { phase } from '@orbital-frame/core'
import errorTrap from './error-trap'

const messengerService = {
  respond: jest.fn()
}
const context = 'context'

describe('Error Trap plugin', () => {
  it('should rethrow errors that happen outside of the lifecycle', () => {
    const et = errorTrap({ messengerService })

    let err
    try {
      et[phase.LOAD_PLUGINS].error(new Error('Throwing'), {})
    } catch (e) {
      err = e
    }

    expect(err.message).toBe('Throwing')
    expect(messengerService.respond).not.toHaveBeenCalled()
  })

  it('should intercept catchable errors', () => {
    const et = errorTrap({ messengerService })

    et[phase.EXECUTE].error(new Error('Throwing'), { context })

    expect(messengerService.respond).toHaveBeenCalledWith(context, '`Error: Throwing`')
  })
})
