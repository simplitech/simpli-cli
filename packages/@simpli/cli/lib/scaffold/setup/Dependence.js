const uniq = require('lodash.uniq')

module.exports = class Dependence {
  constructor (module, singleLine = true, inside = true) {
    this.module = module || null
    this.singleLine = singleLine
    this.inside = inside
    this.onlyName = false
    this.children = []
  }

  get hasChildren () {
    return !!this.children.length
  }

  addChild (str) {
    this.children.push(str)
    this.children = (uniq(this.children) || []).sort() || []
    if (this.children.length >= 5) this.singleLine = false
  }

  /**
   * Print this dependence into the template generator
   */
  build () {
    if (this.singleLine) {
      if (!this.inside) {
        return `import ${this.children[0]} from '${this.module}'`
      }
      return `import {${this.children.join(', ')}} from '${this.module}'`
    }
    return `import {\n  ${this.children.join(', \n  ')},\n} from '${this.module}'`
  }
}
