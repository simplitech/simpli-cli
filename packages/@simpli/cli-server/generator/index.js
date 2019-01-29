module.exports = (api, options) => {
  if (options.seed) {
    api.renderFrom('./injected', 'data.sql', `./src/test/resources/database/data.sql`)
    return
  }

  if (!options.sync) {
    api.render('./template')
    api.renderFrom('./injected', 'data.sql', `./src/test/resources/database/data.sql`)
  }

  const commonTables = options.serverSetup.commonTables
  const pivotTables = options.serverSetup.pivotTables
  const dir = options.serverSetup.packageDir
  const moduleName = options.serverSetup.moduleName

  if (!options.sync) {
    // main/app
    api.renderFrom('./injected', 'src/main/app/AppProvider.kt', `../java/${dir}/app/AppProvider.kt`)
    api.renderFrom('./injected', 'src/main/app/Cast.kt', `../java/${dir}/app/Cast.kt`)
    api.renderFrom('./injected', 'src/main/app/Env.kt', `../java/${dir}/app/Env.kt`)
    api.renderFrom('./injected', 'src/main/app/RequestLogger.kt', `../java/${dir}/app/RequestLogger.kt`)
    api.renderFrom('./injected', 'src/main/app/SwaggerInit.kt', `../java/${dir}/app/SwaggerInit.kt`)

    // main/enums
    api.renderFrom('./injected', 'src/main/enums/Lang.kt', `../java/${dir}/enums/Lang.kt`)

    // main/exception
    api.renderFrom('./injected', 'src/main/exception/HttpException.kt', `../java/${dir}/exception/HttpException.kt`)

    // main/exception/response
    api.renderFrom('./injected', 'src/main/exception/response/BadGatewayException.kt', `../../java/${dir}/exception/response/BadGatewayException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/BadRequestException.kt', `../../java/${dir}/exception/response/BadRequestException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ConflictException.kt', `../../java/${dir}/exception/response/ConflictException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ExpectationFailedException.kt', `../../java/${dir}/exception/response/ExpectationFailedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ForbiddenException.kt', `../../java/${dir}/exception/response/ForbiddenException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/GatewayTimeoutException.kt', `../../java/${dir}/exception/response/GatewayTimeoutException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/GoneException.kt', `../../java/${dir}/exception/response/GoneException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/HttpVersionNotSupportedException.kt', `../../java/${dir}/exception/response/HttpVersionNotSupportedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/InternalServerErrorException.kt', `../../java/${dir}/exception/response/InternalServerErrorException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/LengthRequiredException.kt', `../../java/${dir}/exception/response/LengthRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/MethodNotAllowedException.kt', `../../java/${dir}/exception/response/MethodNotAllowedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotAcceptableException.kt', `../../java/${dir}/exception/response/NotAcceptableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotFoundException.kt', `../../java/${dir}/exception/response/NotFoundException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/NotImplementedException.kt', `../../java/${dir}/exception/response/NotImplementedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/PaymentRequiredException.kt', `../../java/${dir}/exception/response/PaymentRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/PreconditionFailedException.kt', `../../java/${dir}/exception/response/PreconditionFailedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ProxyAuthenticationRequiredException.kt', `../../java/${dir}/exception/response/ProxyAuthenticationRequiredException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestedRangeNotSatisfiableException.kt', `../../java/${dir}/exception/response/RequestedRangeNotSatisfiableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestEntityToLargeException.kt', `../../java/${dir}/exception/response/RequestEntityToLargeException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestTimeoutException.kt', `../../java/${dir}/exception/response/RequestTimeoutException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/RequestUriToLongException.kt', `../../java/${dir}/exception/response/RequestUriToLongException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/ServiceUnavailableException.kt', `../../java/${dir}/exception/response/ServiceUnavailableException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/UnauthorizedException.kt', `../../java/${dir}/exception/response/UnauthorizedException.kt`)
    api.renderFrom('./injected', 'src/main/exception/response/UnsupportedMediaTypeException.kt', `../../java/${dir}/exception/response/UnsupportedMediaTypeException.kt`)

    // main/locale
    api.renderFrom('./injected', 'src/main/locale/EnUs.kt', `../java/${dir}/locale/EnUs.kt`)
    api.renderFrom('./injected', 'src/main/locale/PtBr.kt', `../java/${dir}/locale/PtBr.kt`)

    // main/model/collection
    api.renderFrom('./injected', 'src/main/model/collection/PageCollection.kt', `../../java/${dir}/model/collection/PageCollection.kt`)

    // main/param
    api.renderFrom('./injected', 'src/main/param/DefaultParam.kt', `../java/${dir}/param/DefaultParam.kt`)

    // main/wrapper
    api.renderFrom('./injected', 'src/main/wrapper/GatewayWrapper.kt', `../java/${dir}/wrapper/GatewayWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/MailWrapper.kt', `../java/${dir}/wrapper/MailWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/ModelWrapper.kt', `../java/${dir}/wrapper/ModelWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/ProcessWrapper.kt', `../java/${dir}/wrapper/ProcessWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/RouterWrapper.kt', `../java/${dir}/wrapper/RouterWrapper.kt`)
    api.renderFrom('./injected', 'src/main/wrapper/SocketWrapper.kt', `../java/${dir}/wrapper/SocketWrapper.kt`)

    // main/module/auth
    api.renderFrom('./injected', 'src/main/module/auth/AuthDao.kt', `../../java/${dir}/${moduleName}/auth/AuthDao.kt`)
    api.renderFrom('./injected', 'src/main/module/auth/AuthProcess.kt', `../../java/${dir}/${moduleName}/auth/AuthProcess.kt`)
    api.renderFrom('./injected', 'src/main/module/auth/AuthRouter.kt', `../../java/${dir}/${moduleName}/auth/AuthRouter.kt`)

    // main/module/gateway
    api.renderFrom('./injected', 'src/main/module/gateway/AuthGateway.kt', `../../java/${dir}/${moduleName}/gateway/AuthGateway.kt`)
    api.renderFrom('./injected', 'src/main/module/gateway/GuestGateway.kt', `../../java/${dir}/${moduleName}/gateway/GuestGateway.kt`)

    // main/module/mail
    api.renderFrom('./injected', 'src/main/module/mail/ResetPasswordMail.kt', `../../java/${dir}/${moduleName}/mail/ResetPasswordMail.kt`)

    // main/module/request
    api.renderFrom('./injected', 'src/main/module/request/AuthRequest.kt', `../../java/${dir}/${moduleName}/request/AuthRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/ChangePasswordRequest.kt', `../../java/${dir}/${moduleName}/request/ChangePasswordRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/RecoverPasswordRequest.kt', `../../java/${dir}/${moduleName}/request/RecoverPasswordRequest.kt`)
    api.renderFrom('./injected', 'src/main/module/request/ResetPasswordRequest.kt', `../../java/${dir}/${moduleName}/request/ResetPasswordRequest.kt`)

    // main/module/response
    api.renderFrom('./injected', 'src/main/module/response/AuthResponse.kt', `../../java/${dir}/${moduleName}/response/AuthResponse.kt`)

    // main/module/socket
    api.renderFrom('./injected', 'src/main/module/socket/NotificationSocket.kt', `../../java/${dir}/${moduleName}/socket/NotificationSocket.kt`)

    // test
    api.renderFrom('./injected', 'src/test/AppTest.kt', `./java/${dir}/AppTest.kt`)

    // test/module
    api.renderFrom('./injected', 'src/test/module/MailTest.kt', `../java/${dir}/${moduleName}/MailTest.kt`)
    api.renderFrom('./injected', 'src/test/module/ProcessTest.kt', `../java/${dir}/${moduleName}/ProcessTest.kt`)

    // test/module/auth
    api.renderFrom('./injected', 'src/test/module/auth/AuthProcessTest.kt', `../../java/${dir}/${moduleName}/auth/AuthProcessTest.kt`)
  }

  commonTables.forEach((table) => {
    const data = { table }
    // main/dao
    api.renderFrom('./injected', 'src/main/dao/TemplateDao.kt', `../java/${dir}/dao/${table.modelName}Dao.kt`, data)

    // main/model/resource
    api.renderFrom('./injected', 'src/main/model/resource/Template.kt', `../../java/${dir}/model/resource/${table.modelName}.kt`, data)

    // main/module/process
    api.renderFrom('./injected', 'src/main/module/process/TemplateProcess.kt', `../../java/${dir}/${moduleName}/process/${table.modelName}Process.kt`, data)

    // main/module/router
    api.renderFrom('./injected', 'src/main/module/router/TemplateRouter.kt', `../../java/${dir}/${moduleName}/router/${table.modelName}Router.kt`, data)

    // test/model/resource
    api.renderFrom('./injected', 'src/test/model/resource/TemplateTest.kt', `../../java/${dir}/model/resource/${table.modelName}Test.kt`, data)

    // test/module/process
    api.renderFrom('./injected', 'src/test/module/process/TemplateProcessTest.kt', `../../java/${dir}/${moduleName}/process/${table.modelName}ProcessTest.kt`, data)
  })

  pivotTables.forEach((table) => {
    const data = { table }
    // main/dao
    api.renderFrom('./injected', 'src/main/dao/TemplateDao.kt', `../java/${dir}/dao/${table.modelName}Dao.kt`, data)
  })
}
