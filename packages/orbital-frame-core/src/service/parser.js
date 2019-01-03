import unixParser from '@orbital-frame/interpreter'

const parser = frame => () => ({
  parse (string) {
    return unixParser.parse(string)
  }
})

export default parser
