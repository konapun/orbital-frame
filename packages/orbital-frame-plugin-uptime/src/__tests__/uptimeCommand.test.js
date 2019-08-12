import { phase } from '@orbital-frame/core'
import command from '../uptimeCommand'

const now = 2000
Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now)
const environmentService = {
  get: jest.fn(() => 1000)
}

describe('uptime command', () => {
  it('should return the amount of time elapsed since the bot started running', () => {
    const up = command({ environmentService })

    const result = up.execute()
    expect(result).toBe(1000)
  })

  it('should format the uptime', () => {
    const up = command({ environmentService })

    const formatted = up.format(1000)
    expect(formatted).toBe('1s')
  })
})
