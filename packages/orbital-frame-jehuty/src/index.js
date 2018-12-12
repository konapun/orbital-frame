import orbitalFrame from '@orbital-frame/core'
import commands from './commands'
import plugins from './plugins'

export default hubot => orbitalFrame(hubot, {
  name: 'jehuty',
  commands,
  plugins
})
