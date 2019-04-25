import type from '../metadata/types'

function interpolationBuilder (interpolation) {
  return {
    getMetadata () {
      return {
        [type.INTERPOLATION]: interpolation
      }
    },

    build () {
      return interpolation
    }
  }
}

export default interpolationBuilder
