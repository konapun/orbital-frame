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

  it('should work with async phases', async () => {
    const phaseAction = jest.fn(async () => {
      await new Promise(res => {
        setTimeout(() => {
          res()
        }, 500)
      })

      return 'yee'
    })

    // TODO:
  })

  it('should provide an extension point before the phase is started', () => {

  })

  it('should provide an extension point after the phase runs', () => {

  })

  it('should provide an extension point for phase errors', () => {

  })

  it('should invoke error extensions if before/after extensions throw errors', () => {

  })

  it('should throw phase errors if no error extensions are registered', () => {

  })

  it('should defer to error extensions rather than throwing errors if extensions are available', () => {

  })
})
