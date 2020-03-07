import interactionService from '../interaction'

let configService, environmentService, jobService, listenerService, listenerApi, messengerService, interaction, listenCallback

beforeEach(() => {
  configService = {
    ps2: '>'
  }

  jobService = {
    findOne: jest.fn(() => ({
      context: jest.fn(),
      userId: 1
    })),
    subscribe: jest.fn()
  }

  environmentService = {
    get: jest.fn(() => 1)
  }

  listenerApi = {
    pipe: jest.fn(fn => {
      listenCallback = fn
      return {
        pipe: jest.fn(() => {
          return {
            pipe: jest.fn(() => {
              return {
                end: jest.fn()
              }
            }),
            end: jest.fn()
          }
        }),
        end: jest.fn()
      }
    }),
    end: jest.fn()
  }
  listenerService = {
    listen: jest.fn(() => listenerApi)
  }

  messengerService = {
    respond: jest.fn()
  }

  interaction = interactionService()({ configService, environmentService, jobService, listenerService, messengerService })
})

describe('interaction service', () => {
  it('should not allow multiple interactions for the same PID', () => {

  })

  it('should run interaction channels for separate PIDs separately', async () => {
    // const channel1 = await interaction.createInteractionChannel()
    // const channel2 = await interaction.createInteractionChannel()

    // TODO:
  })

  it('should allow prompting for user input', async () => {
    const interactionChannel = await interaction.createInteractionChannel()
    interactionChannel.prompt('What is your age?')

    expect(messengerService.respond).toHaveBeenCalledWith(expect.any(Function), 'What is your age?')
  })

  it('should require a ">" for interaction responses', async () => {
    await interaction.createInteractionChannel()
    expect(listenerService.listen).toHaveBeenCalledWith('^>')
  })

  it('shouldn\'t invoke the interaction channel on ">" messages for which there are no unfulfilled prompts', async () => {
    // const listener = listenerApi.pipe({ user: { id: 4 }, message: { text: 'konapun' } })
    // listener.pipe = jest.fn(() => {
    //   console.log('CALLED PIPE!')
    // })
    // const interactionChannel = await interaction .createInteractionChannel()
    // const message = await interactionChannel.prompt('What is your name?')

    // console.log('Before pipe')
    // listenerApi.pipe()
    // console.log('After pipe')
  })

  it('should clean up interactions when a job is no longer running', () => {

  })

  // TODO: tests for observe

  describe('multiuser channels', () => {
    it('should only listen to the user who created the interaction channel if no other user IDs are passed in', async () => {
      // TODO:
    })

    it('should listen to input from all users in the interaction channel', async () => {
      // TODO:
    })
  })

  it('should allow changing the foregrounded job per-user', async () => {

  })
})
