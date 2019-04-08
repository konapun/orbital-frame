import execute from '../execute'

let next, args, command
beforeEach(() => {
  next = jest.fn()
  command = jest.fn(() => 'output')
  args = { command }
})

describe('execute phase', () => {
  it('should execute commands', async () => {
    const executionPhase = execute()(next)
    await executionPhase(args)

    expect(command).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ command, output: 'output' })
  })
})
