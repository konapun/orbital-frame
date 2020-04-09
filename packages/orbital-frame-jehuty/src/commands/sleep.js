function sleep () {
  return {
    name: 'sleep',
    synopsis: 'sleep [SECONDS]',
    description: 'Wait for a specified amount of time',
    execute ([ seconds ]) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), seconds * 1000)
      })
    }
  }
}

export default sleep
