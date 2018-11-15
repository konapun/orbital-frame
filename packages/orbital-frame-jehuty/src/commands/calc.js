import { command } from '@orbital-frame/core'
import mathJs from 'mathjs'

export default command('calc', {
  usage: '$0 <expression>',
  description: 'Calculate a mathematical expression',
  options: {},
  format (output) {
    return String(output)
  },
  execute (args) {
    return mathJs.eval(args.join(''))
  }
})
