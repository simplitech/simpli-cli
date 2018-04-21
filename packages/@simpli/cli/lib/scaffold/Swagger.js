const inquirer = require('inquirer')
const request = require('../util/request.js')
const {
  error
} = require('@vue/cli-shared-utils')

module.exports = class Swagger {
  static async requestSwagger (scaffoldSetup, swaggerUrl) {
    if (!swaggerUrl) {
      const { url } = await inquirer.prompt([
        {
          name: 'url',
          type: 'input',
          message: 'Enter swagger.json URL'
        }
      ])
      swaggerUrl = url
    }

    let swaggerJSON
    try {
      const resp = await request.get(swaggerUrl)
      swaggerJSON = resp.body
    } catch (e) {
      error(e.message)
      process.exit(1)
    }

    const { swagger, paths, definitions } = swaggerJSON

    if (!swagger) {
      error('This file is not a valid swagger')
      process.exit(1)
    }

    scaffoldSetup.injectSwagger(definitions, paths)

    const availableModels = scaffoldSetup.exceptPagedRespModels
    const allModels = scaffoldSetup.models

    if (availableModels.length === 0) {
      error('There is no a valid model in this swagger\nUse simpli inspect:swagger to analise your swagger')
      process.exit(1)
    }

    return { swaggerUrl, swaggerJSON, availableModels, allModels }
  }

  static async requestAppName (defaultName) {
    const { appName } = await inquirer.prompt([
      {
        name: 'appName',
        type: 'input',
        default: defaultName || null,
        message: 'Enter the app name'
      }
    ])
    return { appName }
  }

  static async requestApiUrl (defaultApiUrl) {
    const { apiUrlDev } = await inquirer.prompt([
      {
        name: 'apiUrlDev',
        type: 'input',
        default: defaultApiUrl,
        message: 'Enter the API URL in development mode'
      }
    ])
    const { apiUrlProd } = await inquirer.prompt([
      {
        name: 'apiUrlProd',
        type: 'input',
        default: defaultApiUrl,
        message: 'Enter the API URL in production mode'
      }
    ])
    return { apiUrlDev, apiUrlProd }
  }

  static async requestModels (availableModels, scaffoldSetup) {
    const { allModels } = await inquirer.prompt([
      {
        name: 'allModels',
        type: 'confirm',
        message: 'Add all available models?'
      }
    ])

    if (allModels) return { filteredModels: availableModels }

    const { filteredModelNames } = await inquirer.prompt([
      {
        name: 'filteredModelNames',
        type: 'checkbox',
        choices: availableModels.map((model) => model.name),
        message: 'Which of these models do you want to include?'
      }
    ])

    scaffoldSetup.models = scaffoldSetup.models
      .filter((model) => filteredModelNames.find((name) => name === model.name))

    const filteredModels = scaffoldSetup.models
    return { filteredModels }
  }

  static async requestAuthPlugin (models) {
    const { userModel } = await inquirer.prompt([
      {
        name: 'userModel',
        type: 'list',
        choices: models.map((model) => model.name),
        default: models.findIndex((model) => model.name === 'User') || 0,
        message: 'Which one of these is the user model?'
      }
    ])
    const { loginHolderModel } = await inquirer.prompt([
      {
        name: 'loginHolderModel',
        type: 'list',
        choices: models.map((model) => model.name),
        default: models.findIndex((model) => model.name === 'LoginHolder') || 0,
        message: 'Which one of these is the login holder model?'
      }
    ])
    const { loginRespModel } = await inquirer.prompt([
      {
        name: 'loginRespModel',
        type: 'list',
        choices: models.map((model) => model.name),
        default: models.findIndex((model) => model.name === 'LoginResp') || 0,
        message: 'Which one of these is the login response model?'
      }
    ])
    return { userModel, loginHolderModel, loginRespModel }
  }

  static async requestLocalePlugin () {
    const { availableLanguages } = await inquirer.prompt([
      {
        name: 'availableLanguages',
        type: 'checkbox',
        message: 'What languages are available?',
        default: ['en-US'],
        choices: [
          'en-US',
          'pt-BR'
        ]
      }
    ])

    if (availableLanguages.length === 0) {
      error('Select at least one language')
      process.exit(1)
    }

    const { defaultLanguage } = await inquirer.prompt([
      {
        name: 'defaultLanguage',
        type: 'list',
        message: 'What is the default language?',
        choices: availableLanguages
      }
    ])

    const { defaultCurrency } = await inquirer.prompt([
      {
        name: 'defaultCurrency',
        type: 'list',
        message: 'What is the default currency?',
        choices: [
          'USD',
          'BRL'
        ]
      }
    ])
    return { availableLanguages, defaultLanguage, defaultCurrency }
  }

  static async requestSync (scaffoldSetup) {
    const availableModels = scaffoldSetup.exceptPagedRespModels

    const { syncModelNames } = await inquirer.prompt([
      {
        name: 'syncModelNames',
        type: 'checkbox',
        choices: availableModels.map((model) => model.name),
        message: 'Which models do you want to sync?'
      }
    ])

    scaffoldSetup.models = scaffoldSetup.models
      .filter((model) => syncModelNames.find((name) => name === model.name))

    const syncModels = scaffoldSetup.models
    return { syncModels }
  }

  static async confirm () {
    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Confirm this set?'
      }
    ])

    if (!confirm) {
      process.exit(1)
    }
  }
}
