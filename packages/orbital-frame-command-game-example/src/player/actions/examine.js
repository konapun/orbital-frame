export default {
  verbs: [ 'examine' ],
  phases: [ 'active', 'background' ],
  execute (object) {
    console.log('Examining object', object)
  }
}
