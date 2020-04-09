import mathJs from 'mathjs'

export default () => ({
  name: 'calc',
  synopsis: 'calc [EXPRESSION]',
  description: 'Evaluate a mathematical expression',
  options: {},
  format (output) {
    return String(output)
  },
  execute (args) {
    return mathJs.eval(args.join(''))
  }
})
