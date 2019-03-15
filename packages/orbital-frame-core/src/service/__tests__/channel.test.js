import channelService from '../channel'

const frame = {
  getChannels: jest.fn()
}

describe('channel service', () => {
  const channel = channelService(frame)()

  it('should list channels', async () => {
    await channel.list()
    expect(frame.getChannels).toHaveBeenCalled()
  })

  it('should support finding channels', () => {
    expect(channel.find).toBeDefined()
  })

  it('should support finding a single channel', () => {
    expect(channel.findOne).toBeDefined()
  })
})
