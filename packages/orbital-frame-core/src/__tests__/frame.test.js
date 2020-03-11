import frame from '../frame'

const adapter = {
  ps1: '@',
  hear: 'hearFn',
  send: 'sendFn',
  getUsers: 'getUsersFn',
  getChannels: 'getChannelsFn',
  adapterOnlyFn: 'adapterOnlyFn'
}


describe('frame', () => {
  it('should use defaults', () => {
    const f = frame(adapter)
    expect(f).toEqual({
      name: 'orbital-frame',
      plugins: [],
      commands: [],
      ps1: '@',
      ps2: '>',
      hear: 'hearFn',
      send: 'sendFn',
      getUsers: 'getUsersFn',
      getChannels: 'getChannelsFn',
      adapter: { ps1: '@', hear: 'hearFn', send: 'sendFn', getUsers: 'getUsersFn', getChannels: 'getChannelsFn', adapterOnlyFn: 'adapterOnlyFn' },
      storageEngine: expect.objectContaining({ set: expect.any(Function), get: expect.any(Function) })
    })
  })
})
