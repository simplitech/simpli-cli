module.exports = (api, options) => {
  if (!options.sync) {
    api.render('./template')
  }

  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs)
  }
}
