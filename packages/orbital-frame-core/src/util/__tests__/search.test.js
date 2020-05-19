import search from '../search'

const data = [ {
  id: 0,
  firstName: 'Spike',
  lastName: 'Spiegel',
  gender: 'male',
  occupation: 'Bounty Hunter',
  favorite: {
    vice: 'cigarettes',
    planet: 'Earth'
  }
}, {
  id: 1,
  firstName: 'Faye',
  lastName: 'Valentine',
  gender: 'female',
  occupation: 'Bounty Hunter',
  favorite: {
    weapon: 'Glock 30',
    planet: 'Earth'
  }
}, {
  id: 2,
  firstName: 'Jet',
  lastName: 'Black',
  gender: 'male',
  occupation: 'Bounty Hunter',
  favorite: {
    weapon: 'Walther P99',
    vice: 'cigarettes'
  }
} ]

describe('search', () => {
  describe('should work with synchronous list building', () => {
    const buildList = () => data
    const searchApi = search(buildList)

    it('should find multiple items', async () => {
      const matches = await searchApi.find({ occupation: 'Bounty Hunter' })
      expect(matches).toHaveLength(3)
      expect(matches).toEqual([ { favorite: { vice: 'cigarettes', planet: 'Earth' }, firstName: 'Spike', gender: 'male', id: 0, lastName: 'Spiegel', occupation: 'Bounty Hunter' }, { favorite: { weapon: 'Glock 30', planet: 'Earth' }, firstName: 'Faye', gender: 'female', id: 1, lastName: 'Valentine', occupation: 'Bounty Hunter' }, { favorite: { weapon: 'Walther P99', vice: 'cigarettes' }, firstName: 'Jet', gender: 'male', id: 2, lastName: 'Black', occupation: 'Bounty Hunter' } ])
    })

    it('should find single matches', async () => {
      const match = await searchApi.findOne({ gender: 'female' })
      expect(match).toEqual({ favorite: { weapon: 'Glock 30', planet: 'Earth' }, firstName: 'Faye', gender: 'female', id: 1, lastName: 'Valentine', occupation: 'Bounty Hunter' })
    })

    it('should work with nested keys', async () => {
      const match = await searchApi.find({ 'favorite.vice': 'cigarettes' })
      expect(match).toHaveLength(2)
    })

    it('should support multiple filters in a single search', async () => {
      const match = await searchApi.find({ gender: 'male', 'favorite.planet': 'Earth' })
      expect(match).toEqual([ { favorite: { planet: 'Earth', vice: 'cigarettes' }, firstName: 'Spike', gender: 'male', id: 0, lastName: 'Spiegel', occupation: 'Bounty Hunter' } ])
    })

    it('should throw an error when trying to find a single item with no matches', async () => {
      let error
      try {
        await searchApi.findOne({ firstName: 'Vicious' })
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('No items found for search criteria')
    })
  })

  describe('should work with asychronous list building', () => {
    const buildList = async () => new Promise(resolve => {
      setTimeout(() => {
        resolve(data)
      }, 500)
    })
    const searchApi = search(buildList)

    it('should find multiple items', async () => {
      const matches = await searchApi.find({ occupation: 'Bounty Hunter' })
      expect(matches).toHaveLength(3)
      expect(matches).toEqual([ { favorite: { vice: 'cigarettes', planet: 'Earth' }, firstName: 'Spike', gender: 'male', id: 0, lastName: 'Spiegel', occupation: 'Bounty Hunter' }, { favorite: { weapon: 'Glock 30', planet: 'Earth' }, firstName: 'Faye', gender: 'female', id: 1, lastName: 'Valentine', occupation: 'Bounty Hunter' }, { favorite: { weapon: 'Walther P99', vice: 'cigarettes' }, firstName: 'Jet', gender: 'male', id: 2, lastName: 'Black', occupation: 'Bounty Hunter' } ])
    })

    it('should find single matches', async () => {
      const match = await searchApi.findOne({ gender: 'female' })
      expect(match).toEqual({ favorite: { weapon: 'Glock 30', planet: 'Earth' }, firstName: 'Faye', gender: 'female', id: 1, lastName: 'Valentine', occupation: 'Bounty Hunter' })
    })

    it('should support multiple filters in a single search', async () => {
      const match = await searchApi.find({ gender: 'male', 'favorite.planet': 'Earth' })
      expect(match).toEqual([ { favorite: { planet: 'Earth', vice: 'cigarettes' }, firstName: 'Spike', gender: 'male', id: 0, lastName: 'Spiegel', occupation: 'Bounty Hunter' } ])
    })

    it('should throw an error when trying to find a single item with no matches', async () => {
      let error
      try {
        await searchApi.findOne({ firstName: 'Vicious' })
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('No items found for search criteria')
    })

    it('should work with nested keys', async () => {
      const match = await searchApi.find({ 'favorite.vice': 'cigarettes' })
      expect(match).toHaveLength(2)
    })
  })
})
