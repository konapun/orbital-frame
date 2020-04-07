import lifecycle from '../lifecycle'
import { loadPlugins, loadCommands, listen } from '../phases'

jest.mock('../phases')

const services = {
  testService: jest.fn()
}
describe('lifecycle', () => {
  it('should compose lifecycle phases and start the composition on run', () => {
    const lc = lifecycle(services)

    lc.run()
    expect(loadPlugins).toHaveBeenCalledWith(services, expect.any(Function), {})
    expect(loadCommands).toHaveBeenCalledWith(services, expect.any(Function), 'loadPlugins')
    expect(listen).toHaveBeenCalledWith(services, expect.any(Function), 'loadPlugins loadCommands')
  })
})
