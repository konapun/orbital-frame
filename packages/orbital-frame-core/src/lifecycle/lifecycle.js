import compose from 'lodash/fp/compose'
import phases from './phases'

// Add start and end phases to enforce regularity in normal lifecycle phases
const primeLifecycle = phases => [
  ...phases,
  () => () => () => {}
]

const lifecycle = services => {
  const startLifecycle = compose(primeLifecycle(Object.values(phases).map(phase => phase.call(services))))

  return {
    run: startLifecycle()
  }
}

export default lifecycle
