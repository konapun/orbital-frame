import interactionService from '../interaction'

let jobService, listenerService, messengerService, interaction, listenCallback

beforeEach(() => {
  jobService = {
    findOne: jest.fn(() => ({
      context: jest.fn(),
      userId: 1
    }))
  }

  listenerService = {
    listen () {
      return {
        pipe (fn) {
          listenCallback = fn
          return {
            detach: jest.fn()
          }
        },
        detach: jest.fn()
      }
    }
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

    const name = await promptPromise

    expect(name).toEqual('konapun')
  })

  it('should run interaction channels for separate PIDs separately', async () => {
    const channel1 = await interaction.createInteractionChannel(2)
    const channel2 = await interaction.createInteractionChannel(3)

    // TODO:
  })

  it('should allow prompting for user input', async () => {
    const interactionChannel = await interaction.createInteractionChannel(1)
    interactionChannel.prompt('What is your age?')

    expect(messengerService.respond).toHaveBeenCalledWith(expect.any(Function), 'What is your age?')
  })

  it('should require a ">" for interaction responses', () => {
    // TODO:
  })

  it('shouldn\'t invoke the interaction channel on ">" messages for which there are no unfulfilled prompts', () => {
    // TODO:
  })
})
