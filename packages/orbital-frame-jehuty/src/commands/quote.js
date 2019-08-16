export default () => ({
  name: 'quote',
  description: 'Surround a string with backticks',
  execute (args) {
    return `\`${args.join(' ')}\``
  }
})
