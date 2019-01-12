import {asFunction} from 'awilix'
import commandService from './command'
import configService from './config'
import listenerService from './listener'
import memoryService from './memory'
import messengerService from './messenger'
import parserService from './parser'
import pluginService from './plugin'
import runnerService from './runner'

const serviceRegistry = container => ({
  initialize (frame) {
    container.register({
      commandService: asFunction(commandService(frame)).singleton(),
      configService: asFunction(configService(frame)).singleton(),
      listenerService: asFunction(listenerService(frame)).singleton(),
      memoryService: asFunction(memoryService(frame)).singleton(),
      messengerService: asFunction(messengerService(frame)).singleton(),
      parserService: asFunction(parserService(frame)).singleton(),
      pluginService: asFunction(pluginService(frame)).singleton(),
      runnerService: asFunction(runnerService(frame)).singleton()
    })
  }
})

export default serviceRegistry
