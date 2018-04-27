package br.com.martinlabs.usecase.model

import com.google.common.base.Strings
import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.SQLException
import java.util.Date
import com.simpli.model.LanguageHolder
import com.simpli.model.RespException
import com.simpli.sql.*
import java.sql.ResultSet
import com.simpli.tools.Validator



@ApiModel(description="the main model of generator usecase")
class Principal {

    @ApiModelProperty(required = true)
    var grupoDoPrincipal: GrupoDoPrincipal? = null

    var grupoDoPrincipalFacultativo: GrupoDoPrincipal? = null

    @ApiModelProperty(required = true)
    var idPrincipalPk: Long = 0

    @ApiModelProperty(required = true, value = "principal’s mandatory text")
    var textoObrigatorio: String? = null

    var textoFacultativo: String? = null

    @ApiModelProperty(required = true)
    var decimalObrigatorio: Double = 0.0

    var decimalFacultativo: Double? = null

    @ApiModelProperty(required = true)
    var inteiroObrigatorio: Long = 0

    var inteiroFacultativo: Long? = null

    @ApiModelProperty(required = true)
    var booleanoObrigatorio: Boolean = false

    var booleanoFacultativo: Boolean? = null

    @ApiModelProperty(required = true)
    var dataObrigatoria: Date? = null

    var dataFacultativa: Date? = null

    @ApiModelProperty(required = true)
    var datahoraObrigatoria: Date? = null

    var datahoraFacultativa: Date? = null

    @ApiModelProperty(required = true)
    var ativo: Boolean = false

    var email: String? = null

    var senha: String? = null

    var urlImagem: String? = null

    var url: String? = null

    @ApiModelProperty(required = true)
    var unico: String? = null

    @ApiModelProperty(required = true)
    var dataCriacao: Date? = null

    var dataAlteracao: Date? = null

    var nome: String? = null

    var titulo: String? = null

    var cpf: String? = null

    var cnpj: String? = null

    var rg: String? = null

    var celular: String? = null

    var textoGrande: String? = null



    var tagPrincipal: MutableList<Tag>? = null

    var idGrupoDoPrincipalFk: Long
        get() = grupoDoPrincipal?.idGrupoDoPrincipalPk ?: 0
        set(idGrupoDoPrincipalFk) {
            if (grupoDoPrincipal == null) {
                grupoDoPrincipal = GrupoDoPrincipal()
            }
            
            grupoDoPrincipal?.idGrupoDoPrincipalPk = idGrupoDoPrincipalFk
        }

    var idGrupoDoPrincipalFacultativoFk: Long?
        get() = if (grupoDoPrincipalFacultativo == null || grupoDoPrincipalFacultativo?.idGrupoDoPrincipalPk == 0L) null else grupoDoPrincipalFacultativo?.idGrupoDoPrincipalPk
        set(idGrupoDoPrincipalFacultativoFk) {
            if (idGrupoDoPrincipalFacultativoFk == null) {
                grupoDoPrincipalFacultativo = null
                return
            }

            if (grupoDoPrincipalFacultativo == null) {
                grupoDoPrincipalFacultativo = GrupoDoPrincipal()
            }
            
            grupoDoPrincipalFacultativo?.idGrupoDoPrincipalPk = idGrupoDoPrincipalFacultativoFk
        }

    constructor() {}

    constructor(other: Principal) {

        this.grupoDoPrincipal = other.grupoDoPrincipal
        this.grupoDoPrincipalFacultativo = other.grupoDoPrincipalFacultativo
        this.idPrincipalPk = other.idPrincipalPk
        this.textoObrigatorio = other.textoObrigatorio
        this.textoFacultativo = other.textoFacultativo
        this.decimalObrigatorio = other.decimalObrigatorio
        this.decimalFacultativo = other.decimalFacultativo
        this.inteiroObrigatorio = other.inteiroObrigatorio
        this.inteiroFacultativo = other.inteiroFacultativo
        this.booleanoObrigatorio = other.booleanoObrigatorio
        this.booleanoFacultativo = other.booleanoFacultativo
        this.dataObrigatoria = other.dataObrigatoria
        this.dataFacultativa = other.dataFacultativa
        this.datahoraObrigatoria = other.datahoraObrigatoria
        this.datahoraFacultativa = other.datahoraFacultativa
        this.ativo = other.ativo
        this.email = other.email
        this.senha = other.senha
        this.urlImagem = other.urlImagem
        this.url = other.url
        this.unico = other.unico
        this.dataCriacao = other.dataCriacao
        this.dataAlteracao = other.dataAlteracao
        this.nome = other.nome
        this.titulo = other.titulo
        this.cpf = other.cpf
        this.cnpj = other.cnpj
        this.rg = other.rg
        this.celular = other.celular
        this.textoGrande = other.textoGrande
        this.tagPrincipal = other.tagPrincipal
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (idGrupoDoPrincipalFk == 0L) {
            throw RespException(19, lang.cannotBeNull("Id Grupo Do Principal Fk"))
        }
        if (textoObrigatorio.isNullOrEmpty()) {
            throw RespException(2, lang.cannotBeNull("Texto Obrigatorio"))
        }
        if (textoObrigatorio?.length ?: 0 > 160) {
            throw RespException(2, lang.lengthCannotBeMoreThan("Texto Obrigatorio", 160))
        }
        if (textoFacultativo?.length ?: 0 > 45) {
            throw RespException(3, lang.lengthCannotBeMoreThan("Texto Facultativo", 45))
        }
        if (dataObrigatoria == null) {
            throw RespException(10, lang.cannotBeNull("Data Obrigatoria"))
        }
        if (datahoraObrigatoria == null) {
            throw RespException(12, lang.cannotBeNull("Datahora Obrigatoria"))
        }
        if (email?.length ?: 0 > 200) {
            throw RespException(15, lang.lengthCannotBeMoreThan("Email", 200))
        }
        if (email != null && !Validator.isEmail(email)) {
            throw RespException(15, lang.isNotAValidEmail("Email"))
        }
        if (senha?.length ?: 0 > 200) {
            throw RespException(16, lang.lengthCannotBeMoreThan("Senha", 200))
        }
        if (urlImagem?.length ?: 0 > 200) {
            throw RespException(17, lang.lengthCannotBeMoreThan("Url Imagem", 200))
        }
        if (url?.length ?: 0 > 200) {
            throw RespException(18, lang.lengthCannotBeMoreThan("Url", 200))
        }
        if (unico.isNullOrEmpty()) {
            throw RespException(21, lang.cannotBeNull("Unico"))
        }
        if (unico?.length ?: 0 > 40) {
            throw RespException(21, lang.lengthCannotBeMoreThan("Unico", 40))
        }
        if (nome?.length ?: 0 > 45) {
            throw RespException(24, lang.lengthCannotBeMoreThan("Nome", 45))
        }
        if (titulo?.length ?: 0 > 45) {
            throw RespException(25, lang.lengthCannotBeMoreThan("Titulo", 45))
        }
        if (cpf?.length ?: 0 > 45) {
            throw RespException(26, lang.lengthCannotBeMoreThan("Cpf", 45))
        }
        if (cpf != null && !Validator.isCPF(cpf)) {
            throw RespException(26, lang.isNotAValidCPF("Cpf"))
        }
        if (cnpj?.length ?: 0 > 45) {
            throw RespException(27, lang.lengthCannotBeMoreThan("Cnpj", 45))
        }
        if (cnpj != null && !Validator.isCNPJ(cnpj ?: "")) {
            throw RespException(27, lang.isNotAValidCNPJ("Cnpj"))
        }
        if (rg?.length ?: 0 > 45) {
            throw RespException(28, lang.lengthCannotBeMoreThan("Rg", 45))
        }
        if (celular?.length ?: 0 > 45) {
            throw RespException(29, lang.lengthCannotBeMoreThan("Celular", 45))
        }
        if (textoGrande?.length ?: 0 > 300) {
            throw RespException(30, lang.lengthCannotBeMoreThan("Texto Grande", 300))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "principal"): Principal {
            val principal = Principal()

            principal.idGrupoDoPrincipalFk = rs.getLong(alias, "idGrupoDoPrincipalFk")
            principal.idGrupoDoPrincipalFacultativoFk = rs.getLongOrNull(alias, "idGrupoDoPrincipalFacultativoFk")
            principal.idPrincipalPk = rs.getLong(alias, "idPrincipalPk")
            principal.textoObrigatorio = rs.getString(alias, "textoObrigatorio")
            principal.textoFacultativo = rs.getString(alias, "textoFacultativo")
            principal.decimalObrigatorio = rs.getDouble(alias, "decimalObrigatorio")
            principal.decimalFacultativo = rs.getDoubleOrNull(alias, "decimalFacultativo")
            principal.inteiroObrigatorio = rs.getLong(alias, "inteiroObrigatorio")
            principal.inteiroFacultativo = rs.getLongOrNull(alias, "inteiroFacultativo")
            principal.booleanoObrigatorio = rs.getBoolean(alias, "booleanoObrigatorio")
            principal.booleanoFacultativo = rs.getBooleanOrNull(alias, "booleanoFacultativo")
            principal.dataObrigatoria = rs.getTimestamp(alias, "dataObrigatoria")
            principal.dataFacultativa = rs.getTimestamp(alias, "dataFacultativa")
            principal.datahoraObrigatoria = rs.getTimestamp(alias, "datahoraObrigatoria")
            principal.datahoraFacultativa = rs.getTimestamp(alias, "datahoraFacultativa")
            principal.ativo = rs.getBoolean(alias, "ativo")
            principal.email = rs.getString(alias, "email")
            principal.urlImagem = rs.getString(alias, "urlImagem")
            principal.url = rs.getString(alias, "url")
            principal.unico = rs.getString(alias, "unico")
            principal.dataCriacao = rs.getTimestamp(alias, "dataCriacao")
            principal.dataAlteracao = rs.getTimestamp(alias, "dataAlteracao")
            principal.nome = rs.getString(alias, "nome")
            principal.titulo = rs.getString(alias, "titulo")
            principal.cpf = rs.getString(alias, "cpf")
            principal.cnpj = rs.getString(alias, "cnpj")
            principal.rg = rs.getString(alias, "rg")
            principal.celular = rs.getString(alias, "celular")
            principal.textoGrande = rs.getString(alias, "textoGrande")
            return principal
        }
    }
}
