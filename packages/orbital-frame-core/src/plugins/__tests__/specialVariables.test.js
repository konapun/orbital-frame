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

beforeEach(() => {
  environmentService.set.mockReset()
})

describe('special variables plugin', () => {
  const plugin = specialVariablesPlugin({ environmentService })

  it('should set positional and other argument variables after process', () => {
    plugin[phaseEnum.PROCESS].exit({ metadata })

    expect(environmentService.set).toHaveBeenCalledTimes(6)
    expect(environmentService.set).toHaveBeenCalledWith(0, 'test-command')
    expect(environmentService.set).toHaveBeenCalledWith(1, 'arg1')
    expect(environmentService.set).toHaveBeenCalledWith(2, 'arg2')
    expect(environmentService.set).toHaveBeenCalledWith(3, 'arg3')
    expect(environmentService.set).toHaveBeenCalledWith('#', 3)
    expect(environmentService.set).toHaveBeenCalledWith('@', [ 'arg1', 'arg2', 'arg3' ])
  })

  it('should set exit status variables', () => {
    plugin[phaseEnum.EXECUTE].exit({ command: { pid: 1 } })
    expect(environmentService.set).toHaveBeenCalledWith('?', 0)

    plugin[phaseEnum.EXECUTE].error()
    expect(environmentService.set).toHaveBeenCalledWith('?', 1)
  })

  it('should set enter PID variable', () => {
    plugin[phaseEnum.EXECUTE].enter({ command: { pid: 10 } })
    expect(environmentService.set).toHaveBeenCalledWith('!', 10)
  })

  it('should unset argument variables on respond', () => {
    plugin[phaseEnum.RESPOND].enter()

    expect(environmentService.set).toHaveBeenCalledWith('0', undefined)
    expect(environmentService.set).toHaveBeenCalledWith('1', undefined)
    expect(environmentService.set).toHaveBeenCalledWith('2', undefined)
    expect(environmentService.set).toHaveBeenCalledWith('3', undefined)
    expect(environmentService.set).toHaveBeenCalledWith('#', undefined)
    expect(environmentService.set).toHaveBeenCalledWith('@', undefined)
  })
})
