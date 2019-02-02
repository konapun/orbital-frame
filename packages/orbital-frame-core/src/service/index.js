import { asFunction } from 'awilix'
import commandService from './command'
import compilerService from './compiler'
import configService from './config'
import environmentService from './environment'
import listenerService from './listener'
import messengerService from './messenger'
import pluginService from './plugin'
import runnerService from './runner'

const services = {
  commandService,
  compilerService,
  configService,
  environmentService,
  listenerService,
  messengerService,
  pluginService,
  runnerService
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
