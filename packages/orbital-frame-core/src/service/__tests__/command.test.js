import commandService from '../command'

const services = {}

describe('command service', () => {
  const commandLoader = commandService()(services)

  it('should throw an error when trying to load an invalid command', () => {
    expect(() => commandLoader.load(() => ({ name: 'invalid' }))).toThrow()
  })

  it('should load a single command', () => {
    commandLoader.load(() => ({
      name: 'test1',
      description: 'test1',
      execute: () => {}
    }))

    expect(Object.entries(commandLoader.registry).length).toBe(1)
  })

  it('should throw an error when loading multiple commands with at least one invalid', () => {
    expect(() => commandLoader.load([
      () => ({
        name: 'valid',
        description: 'valid',
        execute: () => {}
      }),
      () => ({
        name: 'invalid'
      })
    ])).toThrow()
  })

  it('should load multiple commands', () => {
    const commandLoader = commandService()(services)

    commandLoader.load([
      () => ({
        name: 'test2',
        description: 'test2',
        execute: () => {}
      }),
      () => ({
        name: 'test3',
        description: 'test3',
        execute: () => {}
      })
    ])

    expect(Object.entries(commandLoader.registry).length).toBe(4)
  })

  it('should list loaded commands', () => {
    expect(Object.keys(commandLoader.registry)).toEqual([ 'test1', 'valid', 'test2', 'test3' ])
  })
})
