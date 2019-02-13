function ifCommand () {
  return {
    name: 'if',
    description: 'TODO',
    execute ([ cond, trueBranch, falseBranch ]) {
      return cond ? trueBranch : falseBranch
    }
  }
}

export default ifCommand
