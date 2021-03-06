import type from './types'
import { SearchError } from '../../error'
import { isObject } from 'lodash'

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
        throw new SearchError('No data found matching criteria')
      }
      const value = found[0].value
      return Array.isArray(value) ? value[0] : value
    }
  }
}

export default metadataWalker
