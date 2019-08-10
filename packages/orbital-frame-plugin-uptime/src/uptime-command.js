import prettyMs from 'pretty-ms'

export default ({ environmentService }) => ({
  name: 'uptime',
  description: 'Get amount of time bot has been running',
  format: prettyMs,
  execute () {
    const currentTime = Date.now()
    const sessionStart = environmentService.get('SESSION_START')

    return currentTime - sessionStart
  }
})
