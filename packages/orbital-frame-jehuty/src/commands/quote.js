export default () => ({
  name: 'quote',
  synopsis: 'quote [ARGUMENT] ...[ARGUMENTS]',
  description: 'Surround a string with backticks',
  execute (args) {
    return `\`${args.join(' ')}\``
  }
})
