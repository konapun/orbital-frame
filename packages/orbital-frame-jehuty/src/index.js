import orbitalFrame from '@orbital-frame/core'
// import commands from './commands'
// import plugins from './plugins'

export default hubot => {
  return {
    run (opts) {
      hubot.hear('@jehuty', response => {
        response.send('Received!')
      })
    }
  }
  // return orbitalFrame(hubot, {
  //   name: 'jehuty',
  //   commands,
  //   plugins
  // })
}
