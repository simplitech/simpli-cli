const ejs = require('ejs')
const slash = require('slash')
const GeneratorAPI = require('./GeneratorAPI')
const sortObject = require('./util/sortObject')
const writeFileTree = require('./util/writeFileTree')
const configTransforms = require('./util/configTransforms')
const { toShortPluginId, matchesPluginId } = require('@vue/cli-shared-utils')

const logger = require('@vue/cli-shared-utils/lib/logger')
const logTypes = {
  log: logger.log,
  info: logger.info,
  done: logger.done,
  warn: logger.warn,
  error: logger.error
}

module.exports = class Generator {
  constructor (context, {
    pkg = {},
    plugins = [],
    completeCbs = [],
    files = {}
  } = {}) {
    this.context = context
    this.plugins = plugins
    this.originalPkg = pkg
    this.pkg = Object.assign({}, pkg)
    this.completeCbs = completeCbs

    // for conflict resolution
    this.depSources = {}
    // virtual file tree
    this.files = files
    this.fileMiddlewares = []
    this.postProcessFilesCbs = []
    // exit messages
    this.exitLogs = []

    // apply generators from plugins
    const cliService = plugins.find(p => p.id === '@simpli/cli-scaffold')
    const rootOptions = cliService && cliService.options
    // apply generators from plugins
    plugins.forEach(({ id, apply, options }) => {
      const api = new GeneratorAPI(id, this, options, rootOptions || {})
      apply(api, options, rootOptions)
    })
  }

  async generate ({
    extractConfigFiles = false,
    checkExisting = false
  } = {}) {
    // extract configs from package.json into dedicated files.
    this.extractConfigFiles(extractConfigFiles, checkExisting)
    // wait for file resolve
    await this.resolveFiles()
    // set package.json
    this.sortPkg()
    if (!this.pkg._ignore) {
      this.files['package.json'] = JSON.stringify(this.pkg, null, 2)
    }
    // write file tree to disk
    await writeFileTree(this.context, this.files)
  }

  extractConfigFiles (extractAll, checkExisting) {
    const extract = key => {
      if (
        configTransforms[key] &&
        this.pkg[key] &&
        // do not extract if the field exists in original package.json
        !this.originalPkg[key]
      ) {
        const value = this.pkg[key]
        const transform = configTransforms[key]
        const res = transform(
          value,
          checkExisting,
          this.context
        )
        const { content, filename } = res
        this.files[filename] = content
        delete this.pkg[key]
      }
    }
    if (extractAll) {
      for (const key in this.pkg) {
        extract(key)
      }
    } else if (!process.env.SIMPLI_CLI_TEST) {
      // by default, always extract vue.config.js
      extract('vue')
    }
  }

  sortPkg () {
    // ensure package.json keys has readable order
    this.pkg.dependencies = sortObject(this.pkg.dependencies)
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies)
    this.pkg.scripts = sortObject(this.pkg.scripts, [
      'serve',
      'build',
      'test',
      'e2e',
      'lint',
      'deploy'
    ])
    this.pkg = sortObject(this.pkg, [
      'name',
      'version',
      'private',
      'scripts',
      'dependencies',
      'devDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest'
    ])
  }

  async resolveFiles () {
    const files = this.files
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render)
    }
    // normalize paths
    Object.keys(files).forEach(file => {
      const normalized = slash(file)
      if (file !== normalized) {
        files[normalized] = files[file]
        delete files[file]
      }
    })
    for (const postProcess of this.postProcessFilesCbs) {
      await postProcess(files)
    }
  }

  hasPlugin (_id) {
    return [
      ...this.plugins.map(p => p.id),
      ...Object.keys(this.pkg.devDependencies || {}),
      ...Object.keys(this.pkg.dependencies || {})
    ].some(id => matchesPluginId(_id, id))
  }

  printExitLogs () {
    if (this.exitLogs.length) {
      this.exitLogs.forEach(({ id, msg, type }) => {
        const shortId = toShortPluginId(id)
        const logFn = logTypes[type]
        if (!logFn) {
          logger.error(`Invalid api.exitLog type '${type}'.`, shortId)
        } else {
          logFn(msg, msg && shortId)
        }
      })
      logger.log()
    }
  }
}
