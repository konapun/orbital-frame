import { isObject } from 'lodash'
import type from './metadataTypes'

const findRec = (node, fn) => {
  if (isObject(node)) {
    return Object.entries(node)
      .forEach(([ type, value ]) => {
        if (fn({ type, value })) {
          console.log('FOUND', { type, value })
        }

        if (Array.isArray(value)) {
          value.map(child => findRec(child, fn))
        } else if (isObject(value)) {
          findRec(value, fn)
        }
      })
  }
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
      console.log('FOUND', found)
      if (found.length === 0) {
        throw new Error('No data found matching criteria')
      }

      return found[0]
    }
  }
}

export default metadataWalker
