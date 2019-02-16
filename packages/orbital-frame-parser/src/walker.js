const treeControl = {
  SUBTREE_STOP: 0
}

export default {
  treeControl,
  walk (node, visitor) {
    if (!Array.isArray(node)) {
      const control = visitor(node)
      switch (control) {
      case treeControl.SUBTREE_STOP:
        return
      }
    } else {
      node.forEach(n => this.walk(n, visitor))
    }

    const { body } = node
    if (body) {
      body.forEach(child => this.walk(child, visitor))
    }
  }
}
