const inquirer = require('inquirer')
const chalk = require('chalk')
const request = require('../util/request.js')
const Auth = require('./setup/Auth')
const {
  log,
  error
} = require('@vue/cli-shared-utils')
const flatten = require('lodash.flatten')
const uniqBy = require('lodash.uniqby')

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

    const availableModels = scaffoldSetup.availableModels
    const allModels = scaffoldSetup.models

    if (availableModels.length === 0) {
      error('There is no a valid model in this swagger\nRun simpli scaffold:inspect to analise your swagger')
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
    const { useAllModels } = await inquirer.prompt([
      {
        name: 'useAllModels',
        type: 'confirm',
        message: 'Include all available models?'
      }
    ])

    let filteredModels
    if (!useAllModels) {
      const { filteredModelNames } = await inquirer.prompt([
        {
          name: 'filteredModelNames',
          type: 'checkbox',
          choices: availableModels.map((model) => model.name),
          message: 'Which models do you want to include?'
        }
      ])

      filteredModels = scaffoldSetup.models
        .filter((model) => filteredModelNames.find((name) => name === model.name))
    } else filteredModels = availableModels

    scaffoldSetup.models = filteredModels
    return { filteredModels }
  }

  static async resolveDependencies (availableModels, models) {
    // Attempt to resolve all models dependencies
    models.forEach((model) => model.notResolvedDependencies.forEach((dep) => dep.resolve(models)))

    // List all dependencies which has failed during the resolve
    let notResolvedDependencies = models.map((model) => model.notResolvedDependencies)
    notResolvedDependencies = uniqBy(flatten(notResolvedDependencies), 'module')

    // List all models from these dependencies
    const modelsToBeResolved = availableModels
      .filter((model) => notResolvedDependencies.find((dep) => dep.module === model.name))

    if (modelsToBeResolved.length > 0) {
      log('The models you have chosen have dependencies of the followed models:')

      modelsToBeResolved.forEach((model) => {
        log(chalk.yellow(`  - ${model.name}`))
      })

      const { decision } = await inquirer.prompt([
        {
          name: 'decision',
          type: 'list',
          message: 'Choose an alternative',
          choices: [
            {
              name: 'Include these models too',
              value: 'include'
            },
            {
              name: 'Do not include any object attribute',
              value: 'exclude'
            },
            {
              name: `Force (${chalk.red('it may cause compilation error')})`,
              value: 'force'
            },
            {
              name: 'Cancel',
              value: 'cancel'
            }
          ]
        }
      ])

      if (decision === 'include') {
        modelsToBeResolved.forEach((model) => models.push(model))
        // Check if the new added models has dependencies too
        await this.resolveDependencies(availableModels, models)
      } else if (decision === 'exclude') {
        models.forEach((model) => {
          model.attrs = model.attrs
            .filter((attr) => !modelsToBeResolved.find((item) => item.name === attr.type || item.name === attr.foreignType))
        })
      } else if (decision === 'force') {
        models.forEach((model) => model.notResolvedDependencies.forEach((dep) => dep.resolve(availableModels)))
      } else {
        process.exit(1)
      }
    }
  }

  static async requestAuthPlugin (apis, availableModels = [], filteredModels = []) {
    const { useAuth } = await inquirer.prompt([
      {
        name: 'useAuth',
        type: 'confirm',
        message: 'Use login system?'
      }
    ])

    const auth = new Auth()
    if (!useAuth) return { auth, useAuth }

    const { signInApiName } = await inquirer.prompt([
      {
        name: 'signInApiName',
        type: 'list',
        choices: apis.map((api) => api.name),
        default: apis.findIndex((api) => api.name === 'signIn') || 0,
        message: 'Which API is the sign-in?'
      }
    ])
    const { authApiName } = await inquirer.prompt([
      {
        name: 'authApiName',
        type: 'list',
        choices: apis.map((api) => api.name),
        default: apis.findIndex((api) => api.name === 'authenticate') || 0,
        message: 'Which API is the authentication?'
      }
    ])

    const signInApi = apis.find((api) => api.name === signInApiName)
    const authApi = apis.find((api) => api.name === authApiName)

    const loginHolderModel = availableModels.find((model) => model.name === signInApi.body.model)
    const loginRespModel = availableModels.find((model) => model.name === signInApi.respModel)
    const resetPasswordRequestModel = availableModels.find((model) => model.name === 'ResetPasswordRequest')
    const recoverPasswordRequestModel = availableModels.find((model) => model.name === 'RecoverPasswordRequest')
    const changePasswordRequestModel = availableModels.find((model) => model.name === 'ChangePasswordRequest')

    // Validation
    if (!loginHolderModel) {
      error('Sign-in API must have a request model (e.g. AuthRequest)')
      process.exit(1)
    }
    if (!loginRespModel) {
      error('Sign-in API must have a response model (e.g. AuthResponse)')
      process.exit(1)
    }

    const { accountAttrName } = await inquirer.prompt([
      {
        name: 'accountAttrName',
        type: 'list',
        choices: loginHolderModel.attrs.map((api) => api.name),
        default: loginHolderModel.attrs.findIndex((api) => !!['account', 'email'].find((name) => api.name === name)) || 0,
        message: 'Which attribute is the account (for login)?'
      }
    ])
    const { passwordAttrName } = await inquirer.prompt([
      {
        name: 'passwordAttrName',
        type: 'list',
        choices: loginHolderModel.attrs.map((api) => api.name),
        default: loginHolderModel.attrs.findIndex((api) => !!['password', 'senha'].find((name) => api.name === name)) || 0,
        message: 'Which attribute is the password?'
      }
    ])

    auth.accountAttrName = accountAttrName
    auth.passwordAttrName = passwordAttrName
    auth.api.signIn = signInApi
    auth.api.auth = authApi
    auth.model.loginHolder = loginHolderModel
    auth.model.loginResp = loginRespModel
    auth.model.resetPasswordRequest = resetPasswordRequestModel
    auth.model.recoverPasswordRequest = recoverPasswordRequestModel
    auth.model.changePasswordRequest = changePasswordRequestModel
    auth.setDependencies()

    const exists = (name) => !!filteredModels.find((model) => model.name === name)

    // Add models if they do not exist
    if (!exists(loginHolderModel.name)) filteredModels.push(loginHolderModel)
    if (!exists(loginRespModel.name)) filteredModels.push(loginRespModel)

    const dependenciesModels = auth.dependencies
      .map((dep) => availableModels.find((model) => model.name === dep.module))

    // Add models from dependencies if they do not exist
    dependenciesModels.forEach((model) => {
      if (!exists(model.name)) filteredModels.push(model)
    })

    // Attempt to resolve all models dependencies
    auth.notResolvedDependencies.forEach((dep) => dep.resolve(availableModels))

    return { auth, useAuth }
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

    const syncModels = scaffoldSetup.models
      .filter((model) => syncModelNames.find((name) => name === model.name))

    await this.resolveDependencies(availableModels, syncModels)

    scaffoldSetup.models = syncModels
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
