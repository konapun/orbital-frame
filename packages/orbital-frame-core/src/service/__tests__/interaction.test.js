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

  interaction = interactionService()({ jobService, listenerService, messengerService })
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

  /*
   * Scenarios (some of these should be handled in interaction clients rather than the service directly probably):
   *   1) buzz-in: only want response from first user in channel who answered prompt
   *    - can the prompt define additional criteria for match so the stream stays open?
   *     - "incorrect answer, try again"
   *     - to do this, stream control will probably have to be passed to the user which makes prompt less friendly since rather than awaiting the input it now has to immediately get the stream
   *       - unless the "end" criteria can be passed as a function to the prompt function?
   *         const output = await channel.prompt('Enter a number', val => {
   *           if (!val.match([0-9])) {
   *             channel.send('that is not a number')
   *           } else {
   *             return true // it's ok to end the stream
   *           }
   *         })
   *   2) consensus: don't end prompt until all users in channel have responded to prompt
   *   3) rotation: user being prompted cycles from channel participants
   *    - this is easily done in client code but common enough that the interaction service should automatically handle it
   *      - pluggable interaction strategies?
   *      const output = await
   */
  describe('multiuser channels', () => {
    it('should only listen to the user who created the interaction channel if no other user IDs are passed in', async () => {
      const interactionChannel = await interaction.createInteractionChannel(1)
      const promptPromise = interactionChannel.prompt('What is your name?')

      listenCallback({ message: { text: '>someone', user: { id: 2 } } })
      listenCallback({ message: { text: '>konapun', user: { id: 1 } } })

      const name = await promptPromise

      expect(name).toEqual('konapun')
    })

    it('should listen to input from all users in the interaction channel', async () => {
      const interactionChannel = await interaction.createInteractionChannel(1, [ 1, 2, 3 ])
      const promptPromise = interactionChannel.prompt('What is your name?')
      // TODO: promptAll ?
      listenCallback({ message: { text: '>someone', user: { id: 2 } } })
      listenCallback({ message: { text: '>konapun', user: { id: 1 } } })

      const name = await promptPromise

      expect(name).toEqual('someone')
    })

    it('should listen to all users passed into prompt', async () => {

    })
  })
})
