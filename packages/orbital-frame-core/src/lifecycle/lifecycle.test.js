import lifecycle, {phase} from './index'

describe('lifecycle', () => {
  it('should support plugins', () => {
    let started, ended = false
    phase.START.listen({
      enter () {
        started = true
      },
      exit () {
        ended = true
      }
    })

    lifecycle().run()
    expect(started).toBe(true)
    expect(ended).toBe(true)
    // TODO:
  })
})
