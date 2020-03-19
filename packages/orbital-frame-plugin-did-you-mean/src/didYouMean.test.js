import didYouMean from './didYouMean'
import { phase, error } from '@orbital-frame/core'

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
  it('should ignore errors which are not an instance of CommandNotFoundError', () => {
    const dym = didYouMean({ commandService, messengerService })
    const err = new error.PermissionError('err')
    const context = {
      message: {
        text: '@jehuty tset'
      }
    }

    dym[phase.EXECUTE].error(err, { context })
    expect(messengerService.respond).not.toHaveBeenCalled()
  })

  // TODO: reenable onced instanceof checks work in jest
  xit('should suggest close matches', () => { // eslint-disable-line jest/no-disabled-tests
    const dym = didYouMean({ commandService, messengerService })
    const err = new error.CommandNotFoundError('err')
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
