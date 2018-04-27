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



class User {

    @ApiModelProperty(required = true)
    var idUserPk: Long = 0

    @ApiModelProperty(required = true)
    var email: String? = null

    @ApiModelProperty(required = true)
    var senha: String? = null



    constructor() {}

    constructor(other: User) {

        this.idUserPk = other.idUserPk
        this.email = other.email
        this.senha = other.senha
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (email.isNullOrEmpty()) {
            throw RespException(2, lang.cannotBeNull("Email"))
        }
        if (email?.length ?: 0 > 45) {
            throw RespException(2, lang.lengthCannotBeMoreThan("Email", 45))
        }
        if (!Validator.isEmail(email)) {
            throw RespException(2, lang.isNotAValidEmail("Email"))
        }
        if (!updating) {
            if (senha.isNullOrEmpty()) {
                throw RespException(3, lang.cannotBeNull("Senha"))
            }
        }
        if (senha?.length ?: 0 > 200) {
            throw RespException(3, lang.lengthCannotBeMoreThan("Senha", 200))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "user"): User {
            val user = User()

            user.idUserPk = rs.getLong(alias, "idUserPk")
            user.email = rs.getString(alias, "email")
            return user
        }
    }
}
