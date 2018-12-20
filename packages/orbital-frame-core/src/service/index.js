import awilix from 'awilix'
import listenerService from './listener'
import memoryService from './memory'
import responderService from './responder'
import parserService from './parser'
import runnerService from './runner'

const serviceRegistry = {
  initialize (frame, container) {
    container.register({
      listenerService: awilix.asFunction(listenerService(frame)),
      responderService: awilix.asFunction(responderService(frame)),
      parserService: awilix.asFunction(parserService(frame)),
      runnerService: awilix.asFunction(runnerService(frame))
    })
  }
}

export default serviceRegistry
