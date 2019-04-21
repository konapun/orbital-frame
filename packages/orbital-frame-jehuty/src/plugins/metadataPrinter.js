import { phase } from '@orbital-frame/core'

function metadataPrinter () {
  return {
    [phase.PROCESS]: {
      exit ({ metadata }) {
        console.log('Metadata:', JSON.stringify(metadata.data))
      }
    }
  }
}

export default metadataPrinter
