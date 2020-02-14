import orbitalFrame from '@orbital-frame/core'
import hubotAdapter from '@orbital-frame/adapter-hubot'
import commands from './commands'
import plugins from './plugins'
import hubotConfig from './config'

export default hubot => orbitalFrame(hubotAdapter(hubot, hubotConfig), {
  name: 'jehuty',
  commands,
  plugins
})
