export default {
  lang: {
    code: 'pt-BR',
    name: 'Português',
    decimal: ',',
    thousands: '.',
  },

  currency: {
    USD: {
      prefix: 'USD$',
      precision: '2',
    },
    BRL: {
      prefix: 'R$',
      precision: '2',
    },
  },

  country: {
    BRA: {
      name: 'Brasil',
      alpha2: 'BR',
      alpha3: 'BRA',
      lang: {
        code: 'pt-BR',
        name: 'Português',
      },
    },

    USA: {
      name: 'Estados Unidos',
      alpha2: 'US',
      alpha3: 'USA',
      lang: {
        code: 'en-US',
        name: 'Inglês',
      },
    },
  },

  system: {
    question: {
      confirmRemove: 'Tem certeza que deseja remover este item?',
    },
    info: {
      welcome: 'Bem-vindo',
    },
    success: {
      forgotPassword: 'Um e-mail foi enviado à sua conta',
      changePassword: 'Senha alterada com sucesso',
      persist: 'Salvo com Sucesso!',
    },
    error: {
      unauthorized: 'Acesso Restrito',
      noServer: 'Não foi possível conectar ao servidor',
      validation: 'Erro de validação',
      required: 'Campo \'{0}\' é obrigatório',
      invalidEmail: 'Campo \'{0}\' deve ser um e-mail',
      invalidDate: 'Campo \'{0}\' não possui data válida',
      passwordLength: 'A senha deve ter entre {0} e {1} caracteres',
      samePassword: 'Os campos senha devem ser iguais',
      length: 'Campo \'{0}\' deve ter entre {1} e {2} caracteres',
      minLength: 'Campo \'{0}\' deve conter pelo menos {1} caracteres',
      maxLength: 'Campo \'{0}\' deve ter no máximo {1} caracteres',
      min: 'Campo \'{0}\' deve ser no mínimo {1}',
      max: 'Campo \'{0}\' deve ser no máximo {1}',
      invalidAlpha: 'Campo \'{0}\' deve conter apenas letras',
      invalidAlphanumeric: 'Campo \'{0}\' deve conter apenas letras e números',
      invalidCreditCard: 'Número de cartão de crédito inválido',
    },
  },

  app: {
    title: 'GeneratorUseCase',
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
    totalLines: '{total} entradas no total',
    version: 'Versão',
    onlyIfWantChangePassword: 'Preencha este campo somente se quiser alterar a senha',
  },

  dateFormat: {
    date: 'DD/MM/YYYY',
    datetime: 'DD/MM/YYYY HH:mm',
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
    true: 'Sim',
    false: 'Não',
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
      subtitle: 'Faça Login',
      account: 'Conta',
      password: 'Senha',
      signin: 'Entrar',
    },

    dashboard: {
      title: 'Dashboard',
    },
  },

  persist: {
    number: 'Numérico',
    datetime: 'Data e Hora',
    submit: 'Enviar',
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
        account: 'Conta',
        password: 'Senha',
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
