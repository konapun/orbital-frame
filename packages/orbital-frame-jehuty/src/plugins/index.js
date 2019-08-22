import errorTrap from '@orbital-frame/plugin-error-trap'
import didYouMean from '@orbital-frame/plugin-did-you-mean'
import rcPlugin from '@orbital-frame/plugin-rc'
import { uptimePlugin } from '@orbital-frame/plugin-uptime'
import { restrict } from '@orbital-frame/plugin-restrict-commands'
import setupEnv from './setupEnv'
import example from './example'
import metadataPrinter from './metadataPrinter'

const loadRc = rcPlugin({
  file: `${__dirname}/../../orbital-frame.rc`
})
const restrictCommands = restrict()

export default [
  errorTrap,
  didYouMean,
  // LEAVE THE ABOVE TWO AT THE TOP
  loadRc,
  uptimePlugin,
  restrictCommands,
  setupEnv,
  example,
  metadataPrinter
]
