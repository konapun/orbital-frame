import orbitalFrame from 'orbital-frame'
import commands from './commands'
import plugins from './plugins'

export function bootstrap (hubot) {
  return orbitalFrame(hubot, {
    name: 'jehuty',
    commands,
    plugins
  })
}
