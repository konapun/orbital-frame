import loadPlugins from '../loadPlugins'

jest.mock('../../../plugins/index', () => [ 'corePlugin' ])

const plugins = [ 'userPlugin' ]
const configService = { plugins }
const pluginService = { load: jest.fn() }
const next = jest.fn()

describe('loadPlugins phase', () => {
  it('should find plugins using the config service and load them with the plugin service', () => {
    loadPlugins({ configService, pluginService })(next)()

    expect(pluginService.load).toHaveBeenCalledWith([ 'corePlugin', 'userPlugin' ])
    expect(next).toHaveBeenCalled()
  })
})
