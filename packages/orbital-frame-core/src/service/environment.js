import stateHash from '../util/state'

const state = stateHash()
const environment = () => () => state

export default environment
