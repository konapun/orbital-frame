const treeControl = {
  SUBTREE_STOP: 0
}

export default {
  treeControl,
  async walk (node, visitor) {
    if (node === null) return // boolean options may have a null body
    if (!Array.isArray(node)) {
      const control = await visitor(node)
      switch (control) {
      case treeControl.SUBTREE_STOP:
        return
      }
    } else {
      await Promise.all(node.map(async n => this.walk(n, visitor)))
    }

    const { body } = node
    if (body) {
      await Promise.all(body.map(async child => this.walk(child, visitor)))
    }
  }
}
