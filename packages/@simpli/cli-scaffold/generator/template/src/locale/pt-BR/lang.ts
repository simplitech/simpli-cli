/**
 * @file
 * Language: Portuguese Brazil
 */
export default {
  app: {
    title: '<%- rootOptions.scaffoldSetup.appName || 'Webapp' %>',
    subtitle: 'Painel Admin',
    logout: 'Sair',
    menu: 'Menu',
    add: 'Cadastrar',
    export: 'Exportar',
    select: 'Selecione',
    remove: 'Remover',
    cancel: 'Cancelar',
    noDataToShow: 'Nenhum dado para apresentar',
    downloadCsv: 'Baixar CSV',
    search: 'Buscar',
    submit: 'Enviar',
    totalLines: '{total} entradas no total',
    version: 'Versão',
    onlyIfWantChangePassword: 'Preencha este campo somente se quiser alterar a senha',
  },

  system: {
    question: {
      confirmRemove: 'Tem certeza que deseja remover este item?',
    },
    info: {
      welcome: 'Bem-vindo',
    },
    success: {
      recoverPasswordByMail: 'Um e-mail foi enviado à sua conta',
      resetPassword: 'Senha alterada com sucesso',
      changePassword: 'Senha alterada com sucesso',
      persist: 'Salvo com Sucesso!',
    },
    error: {
      unauthorized: 'Acesso Restrito',
      noServer: 'Não foi possível conectar ao servidor',
    },
  },

  view: {
    signIn: {
      title: 'Fazer Login',
      signin: 'Entrar',
      forgotPassword: 'Esqueci senha',
    },

    recoverPasswordByMail: {
      title: 'Esqueci senha',
      submit: 'Enviar',
      signIn: 'Fazer login',
    },

    resetPassword: {
      title: 'Resetar senha',
      submit: 'Enviar',
    },

    dashboard: {
      title: 'Dashboard',
    },
  },

<%_ var startCase = rootOptions.scaffoldSetup.startCase _%>
<%_ var standardModels = rootOptions.scaffoldSetup.standardModels _%>
<%_ var requestModels = rootOptions.scaffoldSetup.requestModels _%>
<%_ var responseModels = rootOptions.scaffoldSetup.responseModels _%>
<%_ var resourceModels = rootOptions.scaffoldSetup.resourceModels _%>
  resource: {
<%_ for (var i in resourceModels) { var model = resourceModels[i] _%>
    <%-model.name%>: '<%-startCase(model.name)%>',
<%_ } _%>
  },

  schema: {
<%_ for (var i in standardModels) { var model = standardModels[i] _%>
<%- model.buildLocale('Input') -%>
<%- model.buildLocale('List') -%>
<%- model.buildLocale('Csv') -%>
<%_ } _%>
<%_ for (var i in requestModels) { var model = requestModels[i] _%>
<%- model.buildLocale('Input') -%>
<%_ } _%>
<%_ for (var i in responseModels) { var model = responseModels[i] _%>
<%- model.buildLocale('List') -%>
<%- model.buildLocale('Csv') -%>
<%_ } _%>
<%_ for (var i in resourceModels) { var model = resourceModels[i] _%>
<%- model.buildLocale('Input') -%>
<%- model.buildLocale('List') -%>
<%- model.buildLocale('Csv') -%>
<%_ } _%>
  },
}
