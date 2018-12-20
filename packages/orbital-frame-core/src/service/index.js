import awilix from 'awilix'
import configService from './config'
import listenerService from './listener'
import memoryService from './memory'
import responderService from './responder'
import parserService from './parser'
import runnerService from './runner'

const serviceRegistry = {
  initialize (frame, container) {
    container.register({
      configService: awilix.asFunction(configService(frame)),
      listenerService: awilix.asFunction(listenerService(frame)),
      memoryService: awilix.asFunction(memoryService(frame)),
      responderService: awilix.asFunction(responderService(frame)),
      parserService: awilix.asFunction(parserService(frame)),
      runnerService: awilix.asFunction(runnerService(frame))
    })
  }
}

export default serviceRegistry
