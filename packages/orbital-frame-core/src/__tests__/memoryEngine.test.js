import memoryEngine from '../memoryEngine'

describe('memory engine', () => {
  it ('should support set and get', async () => {
    const memory = memoryEngine()

    await memory.set('test', 'worked')
    const value = await memory.get('test')
    expect(value).toBe('worked')
  })
})
