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



class GrupoDoPrincipal {

    @ApiModelProperty(required = true)
    var idGrupoDoPrincipalPk: Long = 0

    @ApiModelProperty(required = true)
    var titulo: String? = null



    constructor() {}

    constructor(other: GrupoDoPrincipal) {

        this.idGrupoDoPrincipalPk = other.idGrupoDoPrincipalPk
        this.titulo = other.titulo
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (titulo.isNullOrEmpty()) {
            throw RespException(2, lang.cannotBeNull("Titulo"))
        }
        if (titulo?.length ?: 0 > 45) {
            throw RespException(2, lang.lengthCannotBeMoreThan("Titulo", 45))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "grupo_do_principal"): GrupoDoPrincipal {
            val grupoDoPrincipal = GrupoDoPrincipal()

            grupoDoPrincipal.idGrupoDoPrincipalPk = rs.getLong(alias, "idGrupoDoPrincipalPk")
            grupoDoPrincipal.titulo = rs.getString(alias, "titulo")
            return grupoDoPrincipal
        }
    }
}
