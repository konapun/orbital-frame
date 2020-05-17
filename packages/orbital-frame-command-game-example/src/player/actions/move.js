export default {
  verbs: [ 'move', 'go', 'walk' ],
  phases: [ 'active' ],
  execute (player, direction) {
    const tile = this.location
    console.log('ON TILE', tile)
    console.log('MOVING DIRECTION', direction)
  }
}
