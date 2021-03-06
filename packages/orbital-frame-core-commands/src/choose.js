import { take, shuffle } from 'lodash'

function choose () {
  return {
    name: 'choose',
    synopsis: 'choose [CHOICE] ...[CHOICES]',
    description: 'Choose one or more values from multiple choices',
    options: {
      n: {
        alias: 'number',
        description: 'Take n choices',
        type: 'number',
        default: 1,
        valid: (value, args) => value > 0 && value <= args.length
      }
    },
    format (choices) {
      return choices.join(' ')
    },
    execute (args, opts) {
      return take(shuffle(args), opts.number)
    }
  }
}

export default choose
