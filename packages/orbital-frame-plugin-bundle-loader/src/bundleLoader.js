import { phase } from '@orbital-frame/core'
import { readdirSync } from 'fs'
import { join } from 'path'

/**
 * Load bundles which are packaged plugins and commands
 */
export default bundleDirectory => ({ commandService, pluginService }) => {
  console.log('BUNDLE LOADER')
  const loadBundle = bundle => {
    console.log('REQUIRING', bundle)
    const { plugin, command } = require(join(bundleDirectory, bundle))

    console.log('GOT PLUGIN', plugin)
    plugin && pluginService.load(plugin)
    command && commandService.load(command)
  }

  return {
    [phase.LOAD_PLUGINS]: {
      exit () {
        try {
          const bundles = readdirSync(bundleDirectory)
          console.log('GOT BUNDLES', bundles)
          bundles.forEach(loadBundle)
        } catch (err) {
          console.error(`Error reading directory contents: ${bundleDirectory}`, err)
        }
      }
    }
  }
}
