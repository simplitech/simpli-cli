const uniq = require('lodash.uniq')

module.exports = class Dependence {
  constructor (module, singleLine = true, inside = true) {
    this.module = module || null
    this.singleLine = singleLine
    this.inside = inside
    this.resolved = true
    this.children = []
  }

  get hasChildren () {
    return !!this.children.length
  }

  addChild (str) {
    this.children.push(str)
    this.children = (uniq(this.children) || []).sort() || []
    if (this.children.length > 6) this.singleLine = false
  }

  /**
   * Resolve path of a given dependence
   */
  resolve (models = []) {
    const model = models.find((model) => model.name === this.module)
    if (model) {
      this.module = model.module
      this.resolved = true
    }
  }

  /**
   * Print this dependence into the template generator
   */
  build (indent = 0) {
    let doubleSpace = ''
    for (let i = 0; i < indent; i++) doubleSpace += '  '
    if (this.singleLine) {
      if (!this.inside) {
        return `${doubleSpace}import ${this.children[0]} from '${this.module}'`
      }
      return `${doubleSpace}import {${this.children.join(', ')}} from '${this.module}'`
    }
    return `${doubleSpace}import {\n  ${doubleSpace}${this.children.join(`,\n  ${doubleSpace}`)},\n${doubleSpace}} from '${this.module}'`
  }

  buildAsCollection () {
    return `import {${this.children[0]}Collection} from '@/model/collection/${this.children[0]}Collection'`
  }
}
