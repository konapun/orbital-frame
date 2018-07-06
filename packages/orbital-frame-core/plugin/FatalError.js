export default class FatalError extends Error {
  constructor (message) {
    super(message)
    this.isFatal = true
  }
}
