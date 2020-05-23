import { phase } from '@orbital-frame/core'
import rcPlugin from '../loadRc'

jest.mock('process', () => ({
  cwd: () => 'CWD'
}))

const compilerService = {
  compile: jest.fn(() => jest.fn())
}

describe('Load RC plugin', () => {
  it('should throw an error if unable to open a file', () => {
    const plugin = rcPlugin({ file: '/some/fake/file' })({ compilerService })

    let error
    try {
      plugin[phase.LOAD_PLUGINS].exit()
    } catch (err) {
      error = err
    }

    expect(error?.message).toBe('Unable to read rc file /some/fake/file (cwd is CWD)')
  })

  it('should compile and execute the RC file line by line', async () => {
    const plugin = rcPlugin({ file: `${__dirname}/data.rc` })({ compilerService })

    await plugin[phase.LOAD_PLUGINS].exit()

    expect(compilerService.compile).toHaveBeenCalledTimes(3)
    expect(compilerService.compile).toHaveBeenCalledWith('line1')
    expect(compilerService.compile).toHaveBeenCalledWith('line2')
    expect(compilerService.compile).toHaveBeenCalledWith('line3')
  })
})
