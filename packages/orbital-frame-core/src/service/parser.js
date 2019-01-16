import unixParser from '@orbital-frame/parser'

const parser = frame => () => ({
  parse (string) {
    return unixParser.parse(string)
  }
})

export default parser
