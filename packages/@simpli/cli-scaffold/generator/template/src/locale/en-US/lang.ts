/**
 * @file
 * Language: English United States
 */
export default {
  app: {
    title: '<%- rootOptions.scaffoldSetup.appName || 'Webapp' %>',
    subtitle: 'Admin Panel',
    logout: 'Logout',
    menu: 'Menu',
    add: 'Add',
    export: 'Export',
    select: 'Select',
    remove: 'Remove',
    cancel: 'Cancel',
    noDataToShow: 'No data to show',
    downloadCsv: 'Download CSV',
    search: 'Search',
    submit: 'Submit',
    totalLines: '{total} total lines',
    version: 'Version',
    onlyIfWantChangePassword: 'Fill this field only if you want to change the password',
  },

  system: {
    question: {
      confirmRemove: 'Are you sure you want to remove this item?',
    },
    info: {
      welcome: 'Welcome',
    },
    success: {
      recoverPasswordByMail: 'An E-Mail has been sent to your account',
      resetPassword: 'The password has successfully changed',
      changePassword: 'The password has successfully changed',
      persist: 'Persisted Successfully!',
    },
    error: {
      unauthorized: 'Restricted Access',
      noServer: 'Could not connect to server',
    },
  },

  view: {
    signIn: {
      title: 'Sign-in',
      signin: 'Sign in',
      forgotPassword: 'Forgot password',
    },

    recoverPasswordByMail: {
      title: 'Forgot Password',
      submit: 'Enviar',
      signIn: 'Sign-in',
    },

    resetPassword: {
      title: 'Reset Password',
      submit: 'Submit',
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
