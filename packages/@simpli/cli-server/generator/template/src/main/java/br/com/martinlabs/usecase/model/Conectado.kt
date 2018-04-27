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



class Conectado {

    @ApiModelProperty(required = true)
    var idConectadoPk: Long = 0

    var titulo: String? = null



    constructor() {}

    constructor(other: Conectado) {

        this.idConectadoPk = other.idConectadoPk
        this.titulo = other.titulo
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (titulo?.length ?: 0 > 45) {
            throw RespException(2, lang.lengthCannotBeMoreThan("Titulo", 45))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "conectado"): Conectado {
            val conectado = Conectado()

            conectado.idConectadoPk = rs.getLong(alias, "idConectadoPk")
            conectado.titulo = rs.getString(alias, "titulo")
            return conectado
        }
    }
}
