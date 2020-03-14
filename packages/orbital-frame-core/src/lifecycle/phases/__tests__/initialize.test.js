import initialize from '../initialize'

const testPromise = jest.fn().mockResolvedValue({ name: 'promise' })
const services = {
  service1: { name: 'service1' },
  service2: testPromise,
  service3: { name: 'service3' }
}
const next = jest.fn()
const args = { arg: 'passthrough' }

describe('initialize phase', () => {
  it('should wait for service definitions to resolve before invoking next stage', async () => {
    const initializePhase = initialize(services)(next)
    await initializePhase(args)

    // TODO:
    expect(next).toHaveBeenCalledWith(args)
  })
})
