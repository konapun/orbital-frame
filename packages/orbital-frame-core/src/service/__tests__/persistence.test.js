import persistenceService from '../persistence'

const frame = {
  storageEngine: {
    get: jest.fn(),
    set: jest.fn()
  }
}

describe('persistence service', () => {
  const persistence = persistenceService(frame)()

  describe('standard', () => {
    it('should support get', async () => {
      frame.storageEngine.get.mockResolvedValueOnce('value')

      const value = await persistence.get('key')
      expect(value).toBe('value')
      expect(frame.storageEngine.get).toHaveBeenCalledWith('key')
    })

    it('should support set', async () => {
      frame.storageEngine.set.mockResolvedValueOnce()

      await persistence.set('key', 'value')
      expect(frame.storageEngine.set).toHaveBeenCalledWith('key', 'value')
    })
  })

  describe('curried', () => {
    const curried = persistence.curry('key')

    it('should support get', async () => {
      frame.storageEngine.get.mockResolvedValueOnce('value')

      const value = await curried.get()
      expect(value).toBe(value)
      expect(frame.storageEngine.get).toHaveBeenCalledWith('key')
    })

    it('should support set', async () => {
      frame.storageEngine.set.mockResolvedValueOnce()

      await curried.set('value')
      expect(frame.storageEngine.set).toHaveBeenCalledWith('key', 'value')
    })
  })

  describe('namespaced', () => {
    const namespaced = persistence.namespace('test')

    it('should support get', async () => {
      frame.storageEngine.get.mockResolvedValueOnce('value')

      const value = await namespaced.get('key')
      expect(value).toBe('value')
      expect(frame.storageEngine.get).toHaveBeenCalledWith('test.key')
    })

    it('should support set', async () => {
      frame.storageEngine.set.mockResolvedValueOnce()

      await namespaced.set('key', 'value')
      expect(frame.storageEngine.set).toHaveBeenCalledWith('test.key', 'value')
    })

    describe('namespaced and curried', () => {
      const curried = namespaced.curry('key')

      it('should support get', async () => {
        frame.storageEngine.get.mockResolvedValueOnce('value')

        const value = await curried.get()
        expect(value).toBe(value)
        expect(frame.storageEngine.get).toHaveBeenCalledWith('test.key')
      })

      it('should support set', async () => {
        frame.storageEngine.set.mockResolvedValueOnce()

        await curried.set('value')
        expect(frame.storageEngine.set).toHaveBeenCalledWith('test.key', 'value')
      })
    })
  })
})
