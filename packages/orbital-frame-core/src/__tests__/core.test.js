import core from '../core'
// import lifecycle from '../lifecycle'
import frame from '../frame'

jest.mock('../service')
jest.mock('../lifecycle')
jest.mock('../frame')

describe('core', () => {

  it('should build sensors and register services', () => {
    core('adapter', 'options')

    expect(frame).toHaveBeenCalledWith('adapter', 'options')
  })

  it('should returrn the lifecycle API', () => {
    const instance = core('adapter', 'options')

    expect(instance.run).toBeDefined()
  })

  describe('lifecycle', () => {
    it('should run the lifecycle', () => {
      // const instance = core('adapter', 'options')
      // instance.run()
      // expect(lifecycle).toHaveBeenLastCalledWith()
      // TODO:
    })
  })
})
