import { phase } from '@orbital-frame/core'
import plugin from '../uptimePlugin'

const now = 12345
Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now)
const environmentService = {
  set: jest.fn()
}

describe('uptime plugin', () => {
  it('should set an environment variable called SESSION_START', () => {
    const up = plugin({ environmentService })

    up[phase.LOAD_PLUGINS].exit()
    expect(environmentService.set).toHaveBeenCalledWith('SESSION_START', now, { readonly: true })
  })
})
