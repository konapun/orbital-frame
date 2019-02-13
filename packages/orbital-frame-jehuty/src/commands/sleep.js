function sleep () {
  return {
    name: 'sleep',
    description: 'TODO',
    execute ([ seconds ]) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), seconds * 1000)
      })
    }
  }
}

export default sleep
