import { isObject } from 'lodash'

export default output => {
  if (Array.isArray(output)) {
    return output.join(' ')
  }
  if (isObject(output)) {
    return Object.entries(output).map(([ key, val ]) => `${key} ${val}`).join('\n')
  }

  return output
}
