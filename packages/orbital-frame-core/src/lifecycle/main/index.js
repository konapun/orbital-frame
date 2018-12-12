import {Phase, chain} from '../../lifecycle'

export default () => {
  while (true) {
    chain([
      Phase.LISTEN,
      Phase.PROCESS_INPUT,
      Phase.EXECUTE,
      Phase.RESPOND
    ])
  }
}
