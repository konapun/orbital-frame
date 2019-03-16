import interactionService from '../interaction'

const jobService = {
  findOne: jest.fn(() => ({
    context: jest.fn(),
    userId: 1
  }))
}

const listenerService = {

}

const messengerService = {

}

describe('interaction service', () => {
  const interaction = interactionService()({ jobService, listenerService, messengerService })

  it('should ignore input from other channels', () => {
    const interactionChannel = interaction.createInteractionChannel(1)
    // TODO:
  })

  it('should allow prompting for user input', () => {
    // TODO:
  })

  it('should require a ">" for interaction responses', () => {
    // TODO:
  })

  it('shouldn\'t invoke the interaction channel on ">" messages for which there are no unfulfilled prompts', () => {
    // TODO:
  })
})
