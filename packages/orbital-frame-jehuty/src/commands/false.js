function falseCommand () {
  return {
    name: 'false',
    synopsis: 'false',
    description: 'Return false',
    execute: () => false
  }
}

export default falseCommand
