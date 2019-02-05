export default {
  walk (node, visitor) { // FIXME: interpolation and variable expansions work much more naturally in a bottom-up evaluation so change this and the compiler to use post-order traversal rather than breadth-first
    if (!Array.isArray(node)) {
      visitor(node)
    } else {
      node.forEach(n => this.walk(n, visitor))
    }

    const { body } = node
    if (body) {
      node.body.forEach(child => this.walk(child, visitor))
    }
  }
}
