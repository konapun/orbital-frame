import errorTrap from '@orbital-frame/plugin-error-trap'
import didYouMean from '@orbital-frame/plugin-did-you-mean'
import rcPlugin from '@orbital-frame/plugin-rc'
import { uptimePlugin } from '@orbital-frame/plugin-uptime'
import bundleLoader from '@orbital-frame/plugin-bundle-loader'
import setupEnv from './setupEnv'
import example from './example'
import metadataPrinter from './metadataPrinter'

const loadRc = rcPlugin({
  file: `${__dirname}/../../orbital-frame.rc`
})

const loadBundles = bundleLoader(`${__dirname}/../bundles`)

export default [
  errorTrap,
  didYouMean,
  // LEAVE THE ABOVE TWO AT THE TOP
  loadRc,
  loadBundles,
  uptimePlugin,
  setupEnv,
  example,
  metadataPrinter
]
