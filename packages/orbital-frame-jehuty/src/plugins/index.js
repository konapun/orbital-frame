import { uptimePlugin } from '@orbital-frame/plugin-uptime'
import setupEnv from './setupEnv'
import errorTrap from './errorTrap'
import example from './example'
import metadataPrinter from './metadataPrinter'

export default [
  uptimePlugin,
  setupEnv,
  example,
  errorTrap,
  metadataPrinter
]
