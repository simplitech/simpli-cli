const execa = require('execa')
const minimist = require('minimist')

const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)

let regex
if (args.p) {
  const packages = (args.p || args.package).split(',').join('|')
  regex = `.*@simpli/(${packages}|cli-plugin-(${packages}))/.*\\.spec\\.js$`
  const i = rawArgs.indexOf('-p')
  rawArgs.splice(i, 2)
}

;(async () => {
  const jestArgs = [
    '--env', 'node',
    '--runInBand',
    ...rawArgs,
    ...(regex ? [regex] : [])
  ]
  console.log(`running jest with args: ${jestArgs.join(' ')}`)
  await execa('jest', jestArgs, {
    stdio: 'inherit'
  })
})().catch(err => {
  err
  process.exit(1)
})
