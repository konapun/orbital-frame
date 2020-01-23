import interactionService from '../interaction'

let configService, jobService, listenerService, messengerService, interaction, listenCallback

beforeEach(() => {
  configService = {
    ps2: '>'
  }

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
            pipe: jest.fn(),
            end: jest.fn()
          }
        },
        end: jest.fn()
      }
    }
  }

  messengerService = {
    respond: jest.fn()
  }

  interaction = interactionService()({ configService, jobService, listenerService, messengerService })
})

describe('interaction service', () => {
  it('should run interaction channels for separate PIDs separately', async () => {
    // const channel1 = await interaction.createInteractionChannel(2)
    // const channel2 = await interaction.createInteractionChannel(3)

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

  // TODO: tests for observe

  describe('multiuser channels', () => {
    it('should only listen to the user who created the interaction channel if no other user IDs are passed in', async () => {
      // TODO:
    })

    it('should listen to input from all users in the interaction channel', async () => {
      // TODO:
    })

    it('should listen to all users passed into prompt', async () => {
      // TODO:
    })
  })
})
