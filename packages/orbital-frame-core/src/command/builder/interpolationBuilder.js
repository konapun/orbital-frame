import type from '../metadata/types'

function interpolationBuilder (interpolation) {
  return {
    getMetadata () {
      return {
        type: type.INTERPOLATION
      }
    },

    build () {
      return interpolation
    }
  }
}

export default interpolationBuilder
