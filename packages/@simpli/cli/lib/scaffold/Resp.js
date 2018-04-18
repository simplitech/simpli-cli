module.exports = class Resp {
  constructor () {
    this.origin = null
  }

  setOrigin (val) {
    this.origin = val || null
  }
}
