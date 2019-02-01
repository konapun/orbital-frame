export default {
  walk (node, visitor) {
    visitor(node)
    node.body.forEach(child => this.walk(child, visitor))
  }
}
