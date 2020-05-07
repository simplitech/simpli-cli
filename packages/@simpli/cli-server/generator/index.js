module.exports = (api, options) => {
  if (options.seed) {
    api.renderFrom('./injected', 'create.sql', `./src/test/resources/database/create.sql`)
    api.renderFrom('./injected', 'data.sql', `./src/test/resources/database/data.sql`)
    return
  }

  if (!options.sync) {
    api.render('./template')
    api.renderFrom('./injected', 'create.sql', `./src/test/resources/database/create.sql`)
    api.renderFrom('./injected', 'data.sql', `./src/test/resources/database/data.sql`)
  }

  const commonTables = options.serverSetup.commonTables
  const pivotTables = options.serverSetup.pivotTables
  const dir = options.serverSetup.packageDir
  const moduleName = options.serverSetup.moduleName

  if (!options.sync) {
    // main/app
    api.renderFrom('./injected', 'src/main/app/AppProvider.kt', `../kotlin/${dir}/app/AppProvider.kt`)
    api.renderFrom('./injected', 'src/main/app/Cast.kt', `../kotlin/${dir}/app/Cast.kt`)
    api.renderFrom('./injected', 'src/main/app/Facade.kt', `../kotlin/${dir}/app/Facade.kt`)
    api.renderFrom('./injected', 'src/main/app/RequestLogger.kt', `../kotlin/${dir}/app/RequestLogger.kt`)

    // main/app/env
    api.renderFrom('./injected', 'src/main/app/env/Props.kt', `../../kotlin/${dir}/app/env/Props.kt`)
    api.renderFrom('./injected', 'src/main/app/env/PropsBeta.kt', `../../kotlin/${dir}/app/env/PropsBeta.kt`)
    api.renderFrom('./injected', 'src/main/app/env/PropsProduction.kt', `../../kotlin/${dir}/app/env/PropsProduction.kt`)
    api.renderFrom('./injected', 'src/main/app/env/PropsStaging.kt', `../../kotlin/${dir}/app/env/PropsStaging.kt`)

    // main/app/healthcheck
    api.renderFrom('./injected', 'src/main/app/healthcheck/HealthCheckDao.kt', `../../kotlin/${dir}/app/healthcheck/HealthCheckDao.kt`)
    api.renderFrom('./injected', 'src/main/app/healthcheck/HealthCheckPipe.kt', `../../kotlin/${dir}/app/healthcheck/HealthCheckPipe.kt`)
    api.renderFrom('./injected', 'src/main/app/healthcheck/HealthCheckProcess.kt', `../../kotlin/${dir}/app/healthcheck/HealthCheckProcess.kt`)
    api.renderFrom('./injected', 'src/main/app/healthcheck/HealthCheckRouter.kt', `../../kotlin/${dir}/app/healthcheck/HealthCheckRouter.kt`)

    // main/enums
    api.renderFrom('./injected', 'src/main/enums/ConnectionStatus.kt', `../kotlin/${dir}/enums/ConnectionStatus.kt`)
    api.renderFrom('./injected', 'src/main/enums/Lang.kt', `../kotlin/${dir}/enums/Lang.kt`)
    api.renderFrom('./injected', 'src/main/enums/Mode.kt', `../kotlin/${dir}/enums/Mode.kt`)

    // main/exception
    api.renderFrom('./injected', 'src/main/exception/HttpException.kt', `../kotlin/${dir}/exception/HttpException.kt`)

    // main/exception/response
    api.renderFrom('./injected', 'src/main/exception/response/BadGatewayException.kt', `../../kotlin/${dir}/exception/response/BadGatewayException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/BadRequestException.kt', `../../kotlin/${dir}/exception/response/BadRequestException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ConflictException.kt', `../../kotlin/${dir}/exception/response/ConflictException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ExpectationFailedException.kt', `../../kotlin/${dir}/exception/response/ExpectationFailedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ForbiddenException.kt', `../../kotlin/${dir}/exception/response/ForbiddenException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/GatewayTimeoutException.kt', `../../kotlin/${dir}/exception/response/GatewayTimeoutException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/GoneException.kt', `../../kotlin/${dir}/exception/response/GoneException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/HttpVersionNotSupportedException.kt', `../../kotlin/${dir}/exception/response/HttpVersionNotSupportedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/InternalServerErrorException.kt', `../../kotlin/${dir}/exception/response/InternalServerErrorException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/LengthRequiredException.kt', `../../kotlin/${dir}/exception/response/LengthRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/MethodNotAllowedException.kt', `../../kotlin/${dir}/exception/response/MethodNotAllowedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotAcceptableException.kt', `../../kotlin/${dir}/exception/response/NotAcceptableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotFoundException.kt', `../../kotlin/${dir}/exception/response/NotFoundException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotImplementedException.kt', `../../kotlin/${dir}/exception/response/NotImplementedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/PaymentRequiredException.kt', `../../kotlin/${dir}/exception/response/PaymentRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/PreconditionFailedException.kt', `../../kotlin/${dir}/exception/response/PreconditionFailedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ProxyAuthenticationRequiredException.kt', `../../kotlin/${dir}/exception/response/ProxyAuthenticationRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestedRangeNotSatisfiableException.kt', `../../kotlin/${dir}/exception/response/RequestedRangeNotSatisfiableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestEntityToLargeException.kt', `../../kotlin/${dir}/exception/response/RequestEntityToLargeException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestTimeoutException.kt', `../../kotlin/${dir}/exception/response/RequestTimeoutException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestUriToLongException.kt', `../../kotlin/${dir}/exception/response/RequestUriToLongException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ServiceUnavailableException.kt', `../../kotlin/${dir}/exception/response/ServiceUnavailableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/UnauthorizedException.kt', `../../kotlin/${dir}/exception/response/UnauthorizedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/UnsupportedMediaTypeException.kt', `../../kotlin/${dir}/exception/response/UnsupportedMediaTypeException.kt`)

    // main/extension
    api.renderFrom('./injected', 'src/main/extension/ContainerResponseContext.kt', `../kotlin/${dir}/extension/ContainerResponseContext.kt`)
    api.renderFrom('./injected', 'src/main/extension/HttpServletRequest.kt', `../kotlin/${dir}/extension/HttpServletRequest.kt`)
    api.renderFrom('./injected', 'src/main/extension/Session.kt', `../kotlin/${dir}/extension/Session.kt`)

    // main/locale
    api.renderFrom('./injected', 'src/main/locale/EnUs.kt', `../kotlin/${dir}/locale/EnUs.kt`)
    api.renderFrom('./injected', 'src/main/locale/PtBr.kt', `../kotlin/${dir}/locale/PtBr.kt`)

    // main/model/filter
    api.renderFrom('./injected', 'src/main/model/filter/ListFilter.kt', `../../kotlin/${dir}/model/filter/ListFilter.kt`)

    // main/model/param
    api.renderFrom('./injected', 'src/main/model/param/DefaultParam.kt', `../../kotlin/${dir}/model/param/DefaultParam.kt`)

    // main/wrapper
    api.renderFrom('./injected', 'src/main/wrapper/MailWrapper.kt', `../kotlin/${dir}/wrapper/MailWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/RouterWrapper.kt', `../kotlin/${dir}/wrapper/RouterWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/SocketWrapper.kt', `../kotlin/${dir}/wrapper/SocketWrapper.kt`)

    // main/module/auth
    api.renderFrom('./injected', 'src/main/module/auth/AuthDao.kt', `../../kotlin/${dir}/${moduleName}/auth/AuthDao.kt`)
    api.renderFrom('./injected', 'src/main/module/auth/AuthProcess.kt', `../../kotlin/${dir}/${moduleName}/auth/AuthProcess.kt`)
    api.renderFrom('./injected', 'src/main/module/auth/AuthRouter.kt', `../../kotlin/${dir}/${moduleName}/auth/AuthRouter.kt`)

    // main/module/mail
    api.renderFrom('./injected', 'src/main/module/mail/RecoverPasswordMail.kt', `../../kotlin/${dir}/${moduleName}/mail/RecoverPasswordMail.kt`)

    // main/module/context
    api.renderFrom('./injected', 'src/main/module/context/AuthPipe.kt', `../../kotlin/${dir}/${moduleName}/context/AuthPipe.kt`)
    api.renderFrom('./injected', 'src/main/module/context/PublicPipe.kt', `../../kotlin/${dir}/${moduleName}/context/PublicPipe.kt`)
    api.renderFrom('./injected', 'src/main/module/context/RequestContext.kt', `../../kotlin/${dir}/${moduleName}/context/RequestContext.kt`)

    // main/module/request
    api.renderFrom('./injected', 'src/main/module/request/AuthRequest.kt', `../../kotlin/${dir}/${moduleName}/request/AuthRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/ChangePasswordRequest.kt', `../../kotlin/${dir}/${moduleName}/request/ChangePasswordRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/RecoverPasswordByMailRequest.kt', `../../kotlin/${dir}/${moduleName}/request/RecoverPasswordByMailRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/ResetPasswordRequest.kt', `../../kotlin/${dir}/${moduleName}/request/ResetPasswordRequest.kt`)

    // main/module/response
    api.renderFrom('./injected', 'src/main/module/response/AuthResponse.kt', `../../kotlin/${dir}/${moduleName}/response/AuthResponse.kt`)

    // main/module/socket
    api.renderFrom('./injected', 'src/main/module/socket/NotificationSocket.kt', `../../kotlin/${dir}/${moduleName}/socket/NotificationSocket.kt`)

    // test
    api.renderFrom('./injected', 'src/test/AppTest.kt', `./kotlin/${dir}/AppTest.kt`)

    // test/module
    api.renderFrom('./injected', 'src/test/module/MailTest.kt', `../kotlin/${dir}/${moduleName}/MailTest.kt`)
    api.renderFrom('./injected', 'src/test/module/ProcessTest.kt', `../kotlin/${dir}/${moduleName}/ProcessTest.kt`)

    // test/module/auth
    api.renderFrom('./injected', 'src/test/module/auth/AuthProcessTest.kt', `../../kotlin/${dir}/${moduleName}/auth/AuthProcessTest.kt`)
  }

  commonTables.forEach((table) => {
    const data = { table }
    // main/dao
    api.renderFrom('./injected', 'src/main/dao/TemplateDao.kt', `../kotlin/${dir}/dao/${table.modelName}Dao.kt`, data)

    // main/model/filter
    api.renderFrom('./injected', 'src/main/model/filter/TemplateListFilter.kt', `../../kotlin/${dir}/model/filter/${table.modelName}ListFilter.kt`, data)

    // main/model/param
    api.renderFrom('./injected', 'src/main/model/param/AuthTemplateListParam.kt', `../../kotlin/${dir}/model/param/Auth${table.modelName}ListParam.kt`, data)

    // main/model/resource
    api.renderFrom('./injected', 'src/main/model/resource/Template.kt', `../../kotlin/${dir}/model/resource/${table.modelName}.kt`, data)

    // main/model/rm
    api.renderFrom('./injected', 'src/main/model/rm/TemplateRM.kt', `../../kotlin/${dir}/model/rm/${table.modelName}RM.kt`, data)

    // main/module/process
    api.renderFrom('./injected', 'src/main/module/process/TemplateProcess.kt', `../../kotlin/${dir}/${moduleName}/process/${table.modelName}Process.kt`, data)

    // main/module/router
    api.renderFrom('./injected', 'src/main/module/router/TemplateRouter.kt', `../../kotlin/${dir}/${moduleName}/router/${table.modelName}Router.kt`, data)

    // test/model/resource
    api.renderFrom('./injected', 'src/test/model/resource/TemplateTest.kt', `../../kotlin/${dir}/model/resource/${table.modelName}Test.kt`, data)

    // test/module/process
    api.renderFrom('./injected', 'src/test/module/process/TemplateProcessTest.kt', `../../kotlin/${dir}/${moduleName}/process/${table.modelName}ProcessTest.kt`, data)
  })

  pivotTables.forEach((table) => {
    const data = { table }
    // main/dao
    api.renderFrom('./injected', 'src/main/dao/TemplateDao.kt', `../kotlin/${dir}/dao/${table.modelName}Dao.kt`, data)
  })
}
