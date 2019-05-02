import frame from '../frame'

const sensors = { hear: 'hear', send: 'send' }
jest.mock('../adapter', () => ({
  HUBOT: jest.fn(() => ({ hear: 'hearFn', send: 'sendFn', getUsers: 'getUsersFn', getChannels: 'getChannelsFn' }))
}))

describe('frame', () => {
  it('should use defaults', () => {
    const f = frame(sensors)
    expect(f).toEqual({
      name: 'orbital-frame',
      plugins: [],
      commands: [],
      hear: 'hearFn',
      send: 'sendFn',
      getUsers: 'getUsersFn',
      getChannels: 'getChannelsFn',
      adapter: { hear: 'hear', send: 'send' }
    })
  })
})
