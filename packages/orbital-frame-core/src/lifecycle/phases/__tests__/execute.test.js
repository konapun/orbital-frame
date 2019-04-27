import execute from '../execute'

const next = jest.fn()
const command = jest.fn(() => 'output')
const args = { command }

describe('execute phase', () => {
  it('should execute commands', async () => {
    const executionPhase = execute()(next)
    await executionPhase(args)

    expect(command).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith({ command, output: 'output' })
  })
})
