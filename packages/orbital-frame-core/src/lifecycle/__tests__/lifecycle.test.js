import lifecycle from '../lifecycle'
import phases from '../phases'

jest.mock('../phases')

describe('lifecycle', () => {
  it('should compose lifecycle phases and start the composition on run', () => {
    const lc = lifecycle()

    lc.run()
    expect(phases.phase1.toHaveBeenCalledWith())
  })

  it('should work with async phases', () => {

  })
})
