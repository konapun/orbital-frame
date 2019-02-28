function cyclicIncrementor (start = 0, max = Number.MAX_VALUE) {
  let currentValue = start - 1
  return {
    reset () {
      currentValue = start - 1
    },
    next () {
      if (currentValue === max) {
        this.reset()
      }

      currentValue++
      return currentValue
    }
  }
}

export default cyclicIncrementor
