import { SearchError } from '../error'
import { get } from 'lodash'

function search (buildList) {
  return {
    async find (criteria) {
      const matcher = item => Object.entries(criteria).every(([ key, value ]) => get(item, key) == value)
      const allItems = await buildList()

      return allItems.filter(matcher)
    },

    async findOne (criteria) {
      const matches = await this.find(criteria)
      if (matches.length === 0) {
        throw new SearchError('No items found for search criteria')
      }

      return matches[0]
    }
  }
}

export default search
