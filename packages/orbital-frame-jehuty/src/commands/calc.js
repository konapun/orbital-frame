import mathJs from 'mathjs'

export default () => ({
  name: 'calc',
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
