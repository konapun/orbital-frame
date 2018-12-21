import phase from './phase'
import start from './start'
import registerPlugins from './registerPlugins'
import registerCommands from './registerCommands'
import main from './main'
import listen from './main/listen'
import process from './main/process'
import execute from './main/execute'
import respond from './main/respond'
import shutdown from './shutdown'
import {flow} from 'lodash/fp'

const phases = [
  // TODO:
]

const lifecycle = services => ({
  run () {
    listen(services, () => { // TODO:
      console.log('DONE!')
    })
  }
})

export default lifecycle
