import { isObject } from 'lodash'
import type from './types'

const findRec = (node, fn, found = []) => {
  if (isObject(node)) {
    Object.entries(node)
      .forEach(([ type, value ]) => {
        if (fn({ type, value })) {
          found.push({ type, value })
        }

        if (Array.isArray(value)) {
          value.map(child => findRec(child, fn, found))
        } else if (isObject(value)) {
          findRec(value, fn, found)
        }
      })
  }

  return found
}

function metadataWalker (data) {
  return {
    data,
    type,
    find (fn) {
      return findRec({ root: data }, fn)
    },
    findOne (fn) {
      const found = this.find(fn)
      if (found.length === 0) {
        throw new Error('No data found matching criteria')
      }
      const value = found[0].value
      if (Array.isArray(value)) { // FIXME:
        return value[0]
      }
    }
  }
}

export default metadataWalker
