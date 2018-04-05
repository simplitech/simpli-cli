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
    date: 'YYYY/MM/DD',
    datetime: 'YYYY/MM/DD hh:mm',
    time: 'hh:mm',
    datemask: '####/##/##',
    datetimemask: '####/##/## ##:##',
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
    submit: 'Submit',
  },

  classes: {
    Conectado: {
      title: 'Conectado',
      columns: {
        idConectadoPk: 'Id Conectado Pk',
        titulo: 'Titulo',
      },
    },
    ConectorPrincipal: {
      title: 'Conector Principal',
      columns: {
        conectado: 'Conectado',
        principal: 'Principal',
        titulo: 'Titulo',
      },
    },
    Endereco: {
      title: 'Endereco',
      columns: {
        idEnderecoPk: 'Id Endereco Pk',
        cep: 'Cep',
        zipcode: 'Zipcode',
        rua: 'Rua',
        nro: 'Nro',
        cidade: 'Cidade',
        uf: 'Uf',
        latitude: 'Latitude',
        longitude: 'Longitude',
      },
    },
    ExtensaoDoPrincipal: {
      title: 'Extensao Do Principal',
      columns: {
        principal: 'Principal',
        titulo: 'Titulo',
      },
    },
    GrupoDoPrincipal: {
      title: 'Grupo Do Principal',
      columns: {
        idGrupoDoPrincipalPk: 'Id Grupo Do Principal Pk',
        titulo: 'Titulo',
      },
    },
    ItemDoPrincipal: {
      title: 'Item Do Principal',
      columns: {
        principal: 'Principal',
        idItemDoPrincipalPk: 'Id Item Do Principal Pk',
        titulo: 'Titulo',
      },
    },
    LoginHolder: {
      title: 'LoginHolder',
      columns: {
        account: 'Account',
        password: 'password',
      },
    },
    Principal: {
      title: 'Principal',
      columns: {
        grupoDoPrincipal: 'Grupo Do Principal',
        grupoDoPrincipalFacultativo: 'Grupo Do Principal Facultativo',
        idPrincipalPk: 'Id Principal Pk',
        textoObrigatorio: 'Texto Obrigatorio',
        textoFacultativo: 'Texto Facultativo',
        decimalObrigatorio: 'Decimal Obrigatorio',
        decimalFacultativo: 'Decimal Facultativo',
        inteiroObrigatorio: 'Inteiro Obrigatorio',
        inteiroFacultativo: 'Inteiro Facultativo',
        booleanoObrigatorio: 'Booleano Obrigatorio',
        booleanoFacultativo: 'Booleano Facultativo',
        dataObrigatoria: 'Data Obrigatoria',
        dataFacultativa: 'Data Facultativa',
        datahoraObrigatoria: 'Datahora Obrigatoria',
        datahoraFacultativa: 'Datahora Facultativa',
        ativo: 'Ativo',
        email: 'Email',
        senha: 'Senha',
        urlImagem: 'Url Imagem',
        url: 'Url',
        unico: 'Unico',
        dataCriacao: 'Data Criacao',
        dataAlteracao: 'Data Alteracao',
        nome: 'Nome',
        titulo: 'Titulo',
        cpf: 'Cpf',
        cnpj: 'Cnpj',
        rg: 'Rg',
        celular: 'Celular',
        textoGrande: 'Texto Grande',
      },
    },
    Tag: {
      title: 'Tag',
      columns: {
        idTagPk: 'Id Tag Pk',
        titulo: 'Titulo',
      },
    },
    TagPrincipal: {
      title: 'Tag Principal',
      columns: {
        tag: 'Tag',
        principal: 'Principal',
      },
    },
    User: {
      title: 'User',
      columns: {
        idUserPk: 'Id User Pk',
        email: 'Email',
        senha: 'Senha',
      },
    },
  },
}
