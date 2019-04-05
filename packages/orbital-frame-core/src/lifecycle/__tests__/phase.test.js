import phase from '../phase'

const services = {
  testService: 'test'
}

const next = jest.fn()

describe('lifecycle phase', () => {
  it('should run the phase action', () => {
    const phaseAction = jest.fn()
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    myPhase.call(services)(next)('args')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should provide an extension point before the phase is started', () => {
    const phaseAction = jest.fn()
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    const enter = jest.fn()
    myPhase.extend({
      enter
    })

    myPhase.call(services)(next)('args')
    expect(enter).toHaveBeenCalledBefore(phaseAction)
    expect(enter).toHaveBeenCalledWith('args')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should provide an extension point after the phase runs', () => {
    const phaseAction = jest.fn((services, next, args) => next(`${args} AFTER`))
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    const exit = jest.fn()
    myPhase.extend({
      exit
    })

    myPhase.call(services)(next)('args')
    expect(exit).toHaveBeenCalledAfter(phaseAction)
    expect(exit).toHaveBeenCalledWith('args AFTER')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should provide an extension point for phase errors', () => {
    const phaseError = new Error('Phase Error')
    const phaseAction = jest.fn(() => {
      throw phaseError
    })
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    const error = jest.fn()
    myPhase.extend({
      error
    })

    myPhase.call(services)(next)('args')
    expect(error).toHaveBeenCalledAfter(phaseAction)
    expect(error).toHaveBeenCalledWith(phaseError, 'args')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should work with async actions', async () => {
    const phaseAction = jest.fn((services, next, args) => next(`${args} AFTER`))
    const myPhase = phase(services => next => async args => {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 200)
      })

      phaseAction(services, next, args)
    })

    const enter = jest.fn()
    const exit = jest.fn()
    myPhase.extend({
      enter,
      exit
    })

    await myPhase.call(services)(next)('args')
    expect(enter).toHaveBeenCalledBefore(phaseAction)
    expect(exit).toHaveBeenCalledAfter(phaseAction)
    expect(exit).toHaveBeenCalledWith('args AFTER')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should invoke error extensions if any before extensions throw errors', () => {
    const phaseError = new Error('Phase Error')
    const phaseAction = jest.fn()
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    const enter = jest.fn(() => {
      throw phaseError
    })
    const error = jest.fn()
    myPhase.extend({
      enter,
      error
    })

    myPhase.call(services)(next)('args')
    expect(error).toHaveBeenCalledWith(phaseError, 'args')
    expect(phaseAction).not.toHaveBeenCalled()
  })

  it('should invoke error extensions if any after extensions throw errors', () => {
    const phaseError = new Error('Phase Error')
    const phaseAction = jest.fn((services, next, args) => next(args))
    const myPhase = phase(services => next => args => {
      phaseAction(services, next, args)
    })

    const exit = jest.fn(() => {
      throw phaseError
    })
    const error = jest.fn()
    myPhase.extend({
      exit,
      error
    })

    myPhase.call(services)(next)('args')
    expect(error).toHaveBeenCalledWith(phaseError, 'args')
    expect(phaseAction).toHaveBeenCalledWith(services, expect.any(Function), 'args')
  })

  it('should throw phase errors if no error extensions are registered', async () => {
    const phaseError = new Error('Phase Error')
    const myPhase = phase(() => () => () => {
      throw phaseError
    })

    let error
    try {
      await myPhase.call(services)(next)('args')
    } catch (err) {
      error = err
    }

    expect(error).toBe(phaseError)
  })

  it('should defer to error extensions rather than throwing errors if extensions are available', async () => {
    const phaseError = new Error('Phase Error')
    const myPhase = phase(() => () => () => {
      throw phaseError
    })

    const error = jest.fn()
    myPhase.extend({ error })

    let err
    try {
      await myPhase.call(services)(next)('args')
    } catch (e) {
      err = e
    }

    expect(err).toBeUndefined()
  })
})
