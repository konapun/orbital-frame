import { phase } from '@orbital-frame/core'
import fs from 'fs'
import readline from 'readline'

const defaults = {
  file: './orbital-frame.rc'
}

export default options => ({ compilerService }) => ({
  [phase.LOAD_PLUGINS]: {
    exit () {
      const { file } = { ...defaults, ...options }

      if (!fs.existsSync(file)) {
        throw new Error(`Unable to read rc file ${file} (cwd is ${process.cwd()})`)
      }
      const lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      })
      lineReader.on('line', source => {
        const command = compilerService.compile(source)
        command()
      })
    }
  }
})
