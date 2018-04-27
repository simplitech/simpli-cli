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



class ConectorPrincipal {

    @ApiModelProperty(required = true)
    var conectado: Conectado? = null

    @ApiModelProperty(required = true)
    var principal: Principal? = null

    @ApiModelProperty(required = true)
    var titulo: String? = null



    var idConectadoFk: Long
        get() = conectado?.idConectadoPk ?: 0
        set(idConectadoFk) {
            if (conectado == null) {
                conectado = Conectado()
            }
            
            conectado?.idConectadoPk = idConectadoFk
        }

    var idPrincipalFk: Long
        get() = principal?.idPrincipalPk ?: 0
        set(idPrincipalFk) {
            if (principal == null) {
                principal = Principal()
            }
            
            principal?.idPrincipalPk = idPrincipalFk
        }

    constructor() {}

    constructor(other: ConectorPrincipal) {

        this.conectado = other.conectado
        this.principal = other.principal
        this.titulo = other.titulo
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (idConectadoFk == 0L) {
            throw RespException(2, lang.cannotBeNull("Id Conectado Fk"))
        }
        if (idPrincipalFk == 0L) {
            throw RespException(1, lang.cannotBeNull("Id Principal Fk"))
        }
        if (titulo.isNullOrEmpty()) {
            throw RespException(3, lang.cannotBeNull("Titulo"))
        }
        if (titulo?.length ?: 0 > 45) {
            throw RespException(3, lang.lengthCannotBeMoreThan("Titulo", 45))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "conector_principal"): ConectorPrincipal {
            val conectorPrincipal = ConectorPrincipal()

            conectorPrincipal.idConectadoFk = rs.getLong(alias, "idConectadoFk")
            conectorPrincipal.idPrincipalFk = rs.getLong(alias, "idPrincipalFk")
            conectorPrincipal.titulo = rs.getString(alias, "titulo")
            return conectorPrincipal
        }
    }
}
