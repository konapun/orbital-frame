import { phaseEnum } from '../lifecycle'

/**
 * Populate variables such as $$, $0, $1, $#, etc.
 */
const specialVariablesPlugin  = ({ environmentService }) => ({
  [phaseEnum.LOAD_PLUGINS]: {
    exit () {
      // TODO:
      console.log('VARIABLES PLUGIN!')
    }
  }
})

export default specialVariablesPlugin
