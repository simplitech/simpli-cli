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



class ItemDoPrincipal {

    @ApiModelProperty(required = true)
    var principal: Principal? = null

    @ApiModelProperty(required = true)
    var idItemDoPrincipalPk: Long = 0

    @ApiModelProperty(required = true)
    var titulo: String? = null



    var idPrincipalFk: Long
        get() = principal?.idPrincipalPk ?: 0
        set(idPrincipalFk) {
            if (principal == null) {
                principal = Principal()
            }
            
            principal?.idPrincipalPk = idPrincipalFk
        }

    constructor() {}

    constructor(other: ItemDoPrincipal) {

        this.principal = other.principal
        this.idItemDoPrincipalPk = other.idItemDoPrincipalPk
        this.titulo = other.titulo
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (idPrincipalFk == 0L) {
            throw RespException(3, lang.cannotBeNull("Id Principal Fk"))
        }
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
        fun buildAll(rs: ResultSet, alias: String = "item_do_principal"): ItemDoPrincipal {
            val itemDoPrincipal = ItemDoPrincipal()

            itemDoPrincipal.idPrincipalFk = rs.getLong(alias, "idPrincipalFk")
            itemDoPrincipal.idItemDoPrincipalPk = rs.getLong(alias, "idItemDoPrincipalPk")
            itemDoPrincipal.titulo = rs.getString(alias, "titulo")
            return itemDoPrincipal
        }
    }
}
