import hubotAdapter from '../index'

describe('hubot adapter', () => {
  it('should parse code blocks for slack', () => {
    const response = {
      send: jest.fn(),
      reply: jest.fn(),
      message: {
        user: {
          id: 1,
          name: 'user'
        },
        channel: 'channel',
        text: '@bot ``` a code block! ```'
      }
    }
    const hear = jest.fn((matcher, callback) => callback(response))
    const adapter = hubotAdapter({
      adapterName: 'slack',
      hear,
      messageRoom: jest.fn(),
      brain: {
        data: {
          users: {}
        }
      }
    })

    const callback = jest.fn()
    hubotAdapter(adapter).hear('matcher', callback)
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.objectContaining({
        text: '@bot  a code block! '
      })
    }))
  })
})
