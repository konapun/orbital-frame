import { command, subprocess } from '@orbital-frame/core'

const subprocessTest = command('subprocess-test', {
  options: {

  },
  format (output) {

  },
  execute (args, opts, {listenService, respondService}) {
    respondService.send('excuting')
    listenService.hear('something').pipe(response => {

    })
  }
})
