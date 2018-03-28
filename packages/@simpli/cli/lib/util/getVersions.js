module.exports = async function getVersions () {
  const current = require(`../../package.json`).version
  let latest
  if (process.env.SIMPLI_CLI_LATEST_VERSION) {
    // cached value
    latest = process.env.SIMPLI_CLI_LATEST_VERSION
  } else if (process.env.SIMPLI_CLI_TEST || process.env.SIMPLI_CLI_DEBUG) {
    // test/debug, use local version
    latest = process.env.SIMPLI_CLI_LATEST_VERSION = current
  } else {
    const request = require('./request.js')
    const registry = `https://registry.npmjs.org`

    const res = await request.get(`${registry}/simpli-cli-version-marker/latest`)
    if (res.statusCode === 200) {
      latest = process.env.SIMPLI_CLI_LATEST_VERSION = res.body.version
    } else {
      // fallback to local version
      latest = process.env.SIMPLI_CLI_LATEST_VERSION = current
    }
  }
  return {
    current,
    latest
  }
}
