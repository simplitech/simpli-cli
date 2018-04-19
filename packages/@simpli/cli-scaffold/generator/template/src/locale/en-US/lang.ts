export default {
  lang: {
    code: 'en-US',
    name: 'English',
    decimal: '.',
    thousands: ',',
  },

  currency: {
    USD: {
      prefix: '$',
      precision: '2',
    },
    BRL: {
      prefix: 'BRL$',
      precision: '2',
    },
  },

  country: {
    BRA: {
      name: 'Brazil',
      alpha2: 'BR',
      alpha3: 'BRA',
      lang: {
        code: 'pt-BR',
        name: 'Portuguese',
      },
    },

    USA: {
      name: 'United States',
      alpha2: 'US',
      alpha3: 'USA',
      lang: {
        code: 'en-US',
        name: 'English',
      },
    },
  },

  system: {
    question: {
      confirmRemove: 'Are you sure you want to remove this item?',
    },
    info: {
      welcome: 'Welcome',
    },
    success: {
      forgotPassword: 'An E-Mail has been sent to your account',
      changePassword: 'The password has successfully changed',
      persist: 'Persisted Successfully!',
    },
    error: {
      unauthorized: 'Restricted Access',
      noServer: 'Could not connect to server',
      validation: 'Validation error',
      required: 'Field \'{0}\' is required',
      invalidEmail: 'Field \'{0}\' must be e-mail',
      invalidDate: 'Field \'{0}\' has not valid date',
      passwordLength: 'The password must have between {0} and {1} characters',
      samePassword: 'The fields password must match',
      length: 'Field \'{0}\' must have between {1} and {2} characters',
      maxLength: 'Field \'{0}\' must not exceed {0} characters',
      minLength: 'Field \'{0}\' must have at least {0} characters',
      min: 'Field \'{0}\' must have a minimum value of {1}',
      max: 'Field \'{0}\' must have a maximum value of {1}',
      invalidAlpha: 'Field \'{0}\' must contain only letters',
      invalidAlphanumeric: 'Field \'{0}\' must contain only letters and numbers',
      invalidCreditCard: 'Invalid card credit number',
    },
  },

  app: {
    title: 'GeneratorUseCase',
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
    totalLines: '{total} total lines',
    version: 'Version',
    onlyIfWantChangePassword: 'Fill this field only if you want to change the password',
  },

  dateFormat: {
    date: 'MM/DD/YYYY',
    datetime: 'MM/DD/YYYY hh:mm',
    time: 'hh:mm',
    datemask: '##/##/####',
    datetimemask: '##/##/#### ##:##',
  },

  format: {
    cpf: '###.###.###-##',
    cnpj: '##.###.###/####-##',
    rg: '##.###.###-#',
    cep: '#####-###',
    phone: '(##) #####-####',
  },

  boolean: {
    true: 'True',
    false: 'False',
  },

  httpResponse: {
    200: 'Ok',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method not Allowed',
    406: 'Not Acceptable',
  },

  view: {
    login: {
      title: 'Login',
      subtitle: 'Please sign in',
      account: 'Account',
      password: 'Password',
      signin: 'Sign in',
    },

    dashboard: {
      title: 'Dashboard',
    },
  },

  persist: {
    number: 'Number',
    datetime: 'Datetime',
    submit: 'Submit',
  },

  classes: {
<%_ var resources = rootOptions.scaffoldSetup.exceptRespModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
<%- resource.buildLocale %>
<%_ } _%>},
}
