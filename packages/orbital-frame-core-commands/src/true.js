function trueCommand () {
  return {
    name: 'true',
    synopsis: 'true',
    description: 'Return true',
    execute: () => true
  }
}

export default trueCommand
