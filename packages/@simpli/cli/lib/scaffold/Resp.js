module.exports = class Resp {
  constructor () {
    this.origin = null
    this.originAttr = null
  }

  setOrigin (val) {
    this.origin = val || null
  }

  setOriginAttr (val) {
    this.originAttr = val || null
  }
}
