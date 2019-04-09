import respond from '../respond'

let messengerService, next, args
beforeEach(() => {
  messengerService = { respond: jest.fn() }
  next = jest.fn()
  args = {
    context: 'context',
    output: [ 'vulcan-gun mounted' ]
  }
})

describe('respond phase', () => {
  it('should use the messengerService to respond', () => {
    respond({ messengerService })(next)(args)

    expect(messengerService.respond).toHaveBeenCalledWith('context', 'vulcan-gun mounted')
    expect(next).toHaveBeenCalledWith({ ...args, response: 'vulcan-gun mounted' })
  })

  it('should join multiple outputs with newlines', () => {
    args = {
      ...args,
      output: [
        'vulcan-gun mounted',
        'machine-cannon mounted'
      ]
    }
    const expected = `vulcan-gun mounted
machine-cannon mounted`

    respond({ messengerService })(next)(args)

    expect(messengerService.respond).toHaveBeenCalledWith('context', expected)
    expect(next).toHaveBeenCalledWith({ ...args, response: expected })
  })
})
