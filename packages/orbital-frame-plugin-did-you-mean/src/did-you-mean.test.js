import didYouMean from './did-you-mean'
import { phase } from '@orbital-frame/core'

const loadedCommands = [
  'test',
  'test2',
  'tester',
  'no-match'
]

const commandService = {
  registry: loadedCommands.reduce((acc, cmd) => ({ ...acc, [cmd]: {} }), {})
}
const messengerService = {
  respond: jest.fn()
}

describe('"Did You Mean" plugin', () => {
  it('should suggest close matches', () => {
    const dym = didYouMean({ commandService, messengerService })
    const err = Error('err')
    const context = {
      message: {
        text: '@jehuty tset'
      }
    }

    const expected = `Did you mean:
    test
    test2`

    dym[phase.EXECUTE].error(err, { context })
    expect(messengerService.respond).toHaveBeenCalledWith(context, expected)
  })
})
