import { uptimeCommand } from '@orbital-frame/plugin-uptime'
import coreCommands from '@orbital-frame/core-commands'
import gameExample from '@orbital-frame/command-game-example'
import interactive from './interactive'
import observer from './observer'
import quote from './quote'
import version from './version'

export default [
  ...coreCommands,
  gameExample,
  uptimeCommand,
  interactive,
  observer,
  quote,
  version
]
