module.exports = (api, options) => {
  if (!options.sync) {
    api.render('./template')
  }

  const commonTables = options.serverSetup.commonTables
  const dir = options.serverSetup.packageDir
  const moduleName = options.serverSetup.moduleName

  // From root
  api.renderFrom('./injected', 'src/main/AppProvider.kt', `./java/${dir}/AppProvider.kt`)
  api.renderFrom('./injected', 'src/main/RouterWrapper.kt', `./java/${dir}/RouterWrapper.kt`)
  api.renderFrom('./injected', 'src/main/SwaggerInit.kt', `./java/${dir}/SwaggerInit.kt`)

  // Router
  api.renderFrom('./injected', 'src/main/module/Router.kt', `../java/${dir}/${moduleName}/Router.kt`)

  // Login Controller
  api.renderFrom('./injected', 'src/main/module/process/LoginService.kt', `../../java/${dir}/${moduleName}/process/LoginService.kt`)
  api.renderFrom('./injected', 'src/main/module/response/LoginResp.kt', `../../java/${dir}/${moduleName}/response/LoginResp.kt`)
  api.renderFrom('./injected', 'src/main/dao/LoginServiceDao.kt', `../java/${dir}/dao/LoginServiceDao.kt`)

  // Test
  api.renderFrom('./injected', 'src/test/module/process/LoginServiceTest.kt', `../../java/${dir}/${moduleName}/process/LoginServiceTest.kt`)
  api.renderFrom('./injected', 'src/test/OtherTest.kt', `./java/${dir}/OtherTest.kt`)

  commonTables.forEach((table) => {
    // const data = { table }
    // api.renderFrom('./injected', 'src/main/dao/TemplateDao.kt', `../java/${dir}/dao/${table.modelName}Dao.kt`, data)
  })
}
