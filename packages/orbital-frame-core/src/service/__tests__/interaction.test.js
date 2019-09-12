import interactionService from '../interaction'

let jobService, listenerService, messengerService, interaction, listenCallback

beforeEach(() => {
  listenCallback = jest.fn()

  jobService = {
    findOne: jest.fn(() => ({
      context: jest.fn(),
      userId: 1
    }))
  }

  listenerService = {
    listen: jest.fn(() => ({
      pipe (fn) {
        listenCallback = jest.fn(fn)
        return {
          end: jest.fn()
        }
      },
      end: jest.fn()
    }))
  }

  messengerService = {
    respond: jest.fn()
  }

  interaction = interactionService()({ jobService, listenerService, messengerService })
})

describe('interaction service', () => {
  it('should ignore input from other channels', async () => {
    const interactionChannel = await interaction.createInteractionChannel(1)
    const promptPromise = interactionChannel.prompt('What is your name?')

    listenCallback({ message: { text: '>someone', user: { id: 2 } } })
    listenCallback({ message: { text: '>konapun', user: { id: 1 } } })
    listenCallback({ message: { text: '>someone else', user: { id: 2 } } })

    const name = await promptPromise

    expect(name).toEqual('konapun')
  })

  it('should allow prompting for user input', async () => {
    const interactionChannel = await interaction.createInteractionChannel(1)
    interactionChannel.prompt('What is your age?')

    expect(messengerService.respond).toHaveBeenCalledWith(expect.any(Function), 'What is your age?')
  })

  it('should require a ">" for interaction responses', async () => {
    await interaction.createInteractionChannel(1)

    expect(listenerService.listen).toHaveBeenCalledWith('^>')
  })

  it('should quit any interaction if a user enters >exit', async () => {

  })

  it('should background a foregrounded interaction when a new interaction starts and run the new interaction in the foreground', async () => {
    const channel1 = await interaction.createInteractionChannel(1)
    // expect(jobService) // TODO: check that channel1 is in foreground

    const channel2 = await interaction.createInteractionChannel(2)
    // expect(jobService) // TODO: check that channel1 is in the background
    // expect(jobService) // TODO: check that channel2 is in the foreground

  })

  it('should deliver > prompt responses to the foregrounded interaction', async () => {
    const channel1 = await interaction.createInteractionChannel(1)
    const channel2 = await interaction.createInteractionChannel(2)

    // TODO:
  })

  it('should foreground a backgrounded interaction when the current foregrounded interaction exits', async () => {
    const channel1 = await interaction.createInteractionChannel(1)
    const channel2 = await interaction.createInteractionChannel(2)

    // TODO:
  })
})
