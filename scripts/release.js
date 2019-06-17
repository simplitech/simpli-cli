process.env.SIMPLI_CLI_RELEASE = true

const execa = require('execa')
const semver = require('semver')
const inquirer = require('inquirer')
const { syncDeps } = require('./syncDeps')
// const { buildEditorConfig } = require('./buildEditorConfig')

const curVersion = require('../lerna.json').version

const release = async () => {
  console.log(`Current version: ${curVersion}`)

  const bumps = ['patch', 'minor', 'major', 'prerelease']
  const versions = {}
  bumps.forEach(b => { versions[b] = semver.inc(curVersion, b) })
  const bumpChoices = bumps.map(b => ({ name: `${b} (${versions[b]})`, value: b }))

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [
        ...bumpChoices,
        { name: 'custom', value: 'custom' }
      ]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: answers => answers.bump === 'custom'
    }
  ])

  const version = customVersion || versions[bump]

  const { yes } = await inquirer.prompt([{
    name: 'yes',
    message: `Confirm releasing ${version}?`,
    type: 'confirm'
  }])

  if (yes) {
    await syncDeps({
      version,
      local: true,
      skipPrompt: true
    })
    delete process.env.PREFIX

    // buildEditorConfig()

    try {
      await execa('git', ['add', '-A'], { stdio: 'inherit' })
      await execa('git', ['commit', '-m', 'chore: pre release sync'], { stdio: 'inherit' })
    } catch (e) {
      // if it's a patch release, there may be no local deps to sync
    }
  }

  const releaseType = semver.diff(curVersion, version)

  const lernaArgs = [
    'publish',
    version,
    '--dist-tag',
    'latest'
  ]
  // keep packages' minor version in sync
  if (releaseType !== 'patch') {
    lernaArgs.push('--force-publish')
  }

  await execa(require.resolve('lerna/cli'), lernaArgs, { stdio: 'inherit' })
}

release().catch(err => {
  console.error(err)
  process.exit(1)
})
