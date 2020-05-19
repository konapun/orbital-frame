function ifCommand () {
  return {
    name: 'if',
    synopsis: 'if [CONDITION] [TRUE BRANCH] [FALSE BRANCH]',
    description: 'Branch based on a condition',
    execute ([ cond, trueBranch, falseBranch ]) {
      return cond ? trueBranch : falseBranch
    }
  }
}

export default ifCommand
