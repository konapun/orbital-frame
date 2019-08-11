import errorTrap from '@orbital-frame/plugin-error-trap'
import didYouMean from '@orbital-frame/plugin-did-you-mean'
import { uptimePlugin } from '@orbital-frame/plugin-uptime'
import setupEnv from './setupEnv'
import example from './example'
import metadataPrinter from './metadataPrinter'

export default [
  errorTrap,
  didYouMean,
  uptimePlugin,
  setupEnv,
  example,
  metadataPrinter
]
