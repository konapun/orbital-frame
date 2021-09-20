import commandService from '../command'

const services = {
  permissionService: {
    isSuperuser: jest.fn()
  }
}

describe('command service', () => {
  const commandLoader = commandService()(services)

  it('should throw an error when trying to load an invalid command', async () => {
    let error
    try {
      await commandLoader.load(() => ({ description: 'invalid' }))
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('ValidationError: "name" is required')
  })

  it('should load a single command', async () => {
    await commandLoader.load(() => ({
      name: 'test1',
      description: 'test1',
      execute: () => {}
    }))

    expect(Object.entries(commandLoader.registry)).toHaveLength(1)
  })

  it('should throw an error when loading multiple commands with at least one invalid', async () => {
    let error
    try {
      await commandLoader.load([
        () => ({
          name: 'valid',
          description: 'valid',
          execute: () => {}
        }),
        () => ({
          description: 'invalid'
        })
      ])
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('ValidationError: "name" is required')
  })

  it('should load multiple commands', async () => {
    const commandLoader = commandService()(services)

    await commandLoader.load([
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

    expect(Object.entries(commandLoader.registry)).toHaveLength(4)
  })

  it('should list loaded commands', () => {
    expect(Object.keys(commandLoader.registry)).toEqual([ 'test1', 'valid', 'test2', 'test3' ])
  })

  it('should not allow non-superusers to overwrite commands', async () => {
    services.permissionService.isSuperuser.mockReturnValueOnce(false)

    await commandLoader.load(() => ({
      name: 'defined',
      description: 'description',
      execute: () => {}
    }))

    let error
    try {
      await commandLoader.load(() => ({
        name: 'defined',
        description: 'overwrite',
        execute: () => {}
      }))
    } catch ({ message }) {
      error = message
    }

    expect(error).toBe('Permission Error: A command "defined" already exists - only superusers can redefine commands')
  })

  it('should allow superusers to overwrite commands', async () => {
    services.permissionService.isSuperuser.mockReturnValueOnce(true)

    let error
    try {
      await commandLoader.load(() => ({
        name: 'defined',
        description: 'overwrite',
        execute: () => {}
      }))
    } catch ({ message }) {
      error = message
    }

    expect(error).toBeUndefined()
  })
})
