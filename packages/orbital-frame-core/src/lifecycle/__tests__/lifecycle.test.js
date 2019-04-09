import lifecycle from '../lifecycle'
import { phase1, phase2, phase3 } from '../phases'

jest.mock('../phases')

const services = {
  testService: jest.fn()
}
describe('lifecycle', () => {
  it('should compose lifecycle phases and start the composition on run', () => {
    const lc = lifecycle(services)

    lc.run()
    expect(phase1).toHaveBeenCalledWith(services, expect.any(Function), undefined)
    expect(phase2).toHaveBeenCalledWith(services, expect.any(Function), 'phase1')
    expect(phase3).toHaveBeenCalledWith(services, expect.any(Function), 'phase1 phase2')
  })

  it('should work with async phases', async () => {
    // TODO: even though phase is tested separately, check that async composition is working
  })
})
