// create package.json and README for packages that don't have one yet

const fs = require('fs')
const path = require('path')
const baseVersion = require('../packages/@simpli/cli/package.json').version

const packagesDir = path.resolve(__dirname, '../packages/@simpli')
const files = fs.readdirSync(packagesDir)

files.forEach(pkg => {
  if (pkg.charAt(0) === '.') return

  const isPlugin = /^cli-plugin-/.test(pkg)
  const desc = isPlugin
    ? `${pkg.replace('cli-plugin-', '')} plugin for simpli-cli`
    : `${pkg.replace('cli-', '')} for simpli-cli`

  const pkgPath = path.join(packagesDir, pkg, `package.json`)
  if (!fs.existsSync(pkgPath)) {
    const json = {
      'name': `@simpli/${pkg}`,
      'version': baseVersion,
      'description': desc,
      'main': 'index.js',
      'publishConfig': {
        'access': 'public'
      },
      'repository': {
        'type': 'git',
        'url': 'git+https://github.com/simplitech/simpli-cli.git'
      },
      'keywords': [
        'simpli',
        'cli'
      ],
      'author': 'Felipe Gibran Eleuterio Toledo',
      'license': 'MIT',
      'bugs': {
        'url': 'https://github.com/simplitech/simpli-cli/issues'
      },
      'homepage': `https://github.com/simplitech/simpli-cli/packages/@simpli/${pkg}#readme`
    }
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2))
  }

  const readmePath = path.join(packagesDir, pkg, `README.md`)
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# @simpli/${pkg}\n\n> ${desc}`)
  }

  const npmIgnorePath = path.join(packagesDir, pkg, `.npmignore`)
  if (!fs.existsSync(npmIgnorePath)) {
    fs.writeFileSync(npmIgnorePath, `__tests__/\n__mocks__/`)
  }
})
