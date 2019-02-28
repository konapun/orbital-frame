import { asFunction } from 'awilix'
import channelService from './channel'
import commandService from './command'
import compilerService from './compiler'
import configService from './config'
import environmentService from './environment'
import interactionService from './interaction'
import jobService from './job'
import listenerService from './listener'
import messengerService from './messenger'
import pluginService from './plugin'
import userService from './user'

const services = {
  channelService,
  commandService,
  compilerService,
  configService,
  environmentService,
  interactionService,
  jobService,
  listenerService,
  messengerService,
  pluginService,
  userService
}

const serviceRegistry = container => ({
  initialize (frame) {
    container.register(
      Object.entries(services)
        .map(([ key, value ]) => ({
          [key]: asFunction(value(frame)).singleton()
        }))
        .reduce((acc, entry) => ({ ...acc, ...entry }), {})
    )
  }
})

export default serviceRegistry
