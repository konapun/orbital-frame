import jobsPlugin from '../jobs'
import stateHash from '../../util/state'
import { phaseEnum } from '../../lifecycle'

const jobService = {
  create: jest.fn(),
  update: jest.fn(),
  status: {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
  }
}

describe('jobs plugin', () => {
  const plugin = jobsPlugin({ jobService })
  const state = stateHash()

  it('should create a new job when a message is received', () => {
    const context = { message: { user: { id: 7 } } }
    plugin[phaseEnum.LISTEN].exit({ context, state })

    expect(jobService.create).toHaveBeenCalledWith(7, { context })
  })

  it('should set a command for the job', () => {
    // const command = 'yee'
    // plugin[phaseEnum.EXECUTE].enter({ command, state })

    // expect(jobService.update).toHaveBeenCalledWith()
  })

  it('should update the job status after execution', () => {
    // plugin[phaseEnum.EXECUTE].exit({ output, state })

    // expect(jobService.update).toHaveBeenCalledWith()
  })

  it('should correctly set job state on command failure', () => {
    // plugin[phaseEnum.EXECUTE].error(err, { state })

    // expect(jobService.update).toHaveBeenCalledWith()
  })
})
