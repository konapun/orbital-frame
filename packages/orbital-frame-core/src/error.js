export class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

export class CommandNotFoundError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CommandNotFoundError'
  }
}

export default { PermissionError, CommandNotFoundError }
