export default {
  walk (node, visitor) {
    visitor(node)

    const { body } = node
    if (body) {
      node.body.forEach(child => this.walk(child, visitor))
    }
  }
}
