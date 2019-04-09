import specialVariablesPlugin from '../specialVariables'
import { phaseEnum } from '../../lifecycle'

const environmentService = {
  set: jest.fn()
}
const metadata = {
  findOne: jest.fn(() => ({
    name: 'test-command',
    arguments: [ 'arg1', 'arg2', 'arg3' ]
  }))
}

describe('special variables plugin', () => {
  const plugin = specialVariablesPlugin({ environmentService })

  it('should set positional variables after process', () => {
    plugin[phaseEnum.PROCESS].exit({ metadata })

    expect(environmentService.set).toHaveBeenCalledTimes(4)
    expect(environmentService.set).toHaveBeenCalledWith(0, 'test-command')
    expect(environmentService.set).toHaveBeenCalledWith(1, 'arg1')
    expect(environmentService.set).toHaveBeenCalledWith(2, 'arg2')
    expect(environmentService.set).toHaveBeenCalledWith(3, 'arg3')
  })
})
