export const treeControl = {
  STOP: 0
}

export default {
  walk (node, visitor) {
    if (!Array.isArray(node)) {
      const control = visitor(node)
      switch (control) {
      case treeControl.STOP:
        return
      }
    } else {
      node.forEach(n => this.walk(n, visitor))
    }

    const { body } = node
    if (body) {
      node.body.forEach(child => this.walk(child, visitor))
    }
  }
}
