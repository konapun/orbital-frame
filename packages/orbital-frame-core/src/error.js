export class CommandNotFoundError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CommandNotFoundError'
  }
}

export class CompilationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CompilationError'
  }
}

export class ParseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ParseError'
  }
}

export class PermissionError extends Error {
  constructor (message) {
    super(`Permission Error: ${message}`)
    this.name = 'PermissionError'
  }
}

export class SearchError extends Error {
  constructor (message) {
    super(message)
    this.name = 'SearchError'
  }
}

export class StateError extends Error {
  constructor (message) {
    super(message)
    this.name = 'StateError'
  }
}

export class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
  }
}

export default {
  CommandNotFoundError,
  CompilationError,
  ParseError,
  PermissionError,
  SearchError,
  StateError,
  ValidationError
}
