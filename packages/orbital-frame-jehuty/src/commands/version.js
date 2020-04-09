import pkg from '../../package.json'

export default () => ({
  name: 'version',
  synopsis: 'version',
  description: 'Get the bot\'s version',
  execute: () => pkg.version
})
