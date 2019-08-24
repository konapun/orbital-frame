import { phase } from '@orbital-frame/core'

function metadataPrinter () {
  return {
    [phase.PROCESS]: {
      exit ({ metadata }) {
        /* eslint-disable no-console */
        console.log('Metadata:', JSON.stringify(metadata.data))
      }
    }
  }
}

export default metadataPrinter
