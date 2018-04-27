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



class Endereco {

    @ApiModelProperty(required = true)
    var idEnderecoPk: Long = 0

    var cep: String? = null

    var zipcode: String? = null

    var rua: String? = null

    var nro: Long? = null

    var cidade: String? = null

    var uf: String? = null

    var latitude: Double? = null

    var longitude: Double? = null



    constructor() {}

    constructor(other: Endereco) {

        this.idEnderecoPk = other.idEnderecoPk
        this.cep = other.cep
        this.zipcode = other.zipcode
        this.rua = other.rua
        this.nro = other.nro
        this.cidade = other.cidade
        this.uf = other.uf
        this.latitude = other.latitude
        this.longitude = other.longitude
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {
        if (cep?.length ?: 0 > 45) {
            throw RespException(2, lang.lengthCannotBeMoreThan("Cep", 45))
        }
        if (zipcode?.length ?: 0 > 45) {
            throw RespException(3, lang.lengthCannotBeMoreThan("Zipcode", 45))
        }
        if (rua?.length ?: 0 > 45) {
            throw RespException(4, lang.lengthCannotBeMoreThan("Rua", 45))
        }
        if (cidade?.length ?: 0 > 45) {
            throw RespException(6, lang.lengthCannotBeMoreThan("Cidade", 45))
        }
        if (uf?.length ?: 0 > 45) {
            throw RespException(7, lang.lengthCannotBeMoreThan("Uf", 45))
        }    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSet, alias: String = "endereco"): Endereco {
            val endereco = Endereco()

            endereco.idEnderecoPk = rs.getLong(alias, "idEnderecoPk")
            endereco.cep = rs.getString(alias, "cep")
            endereco.zipcode = rs.getString(alias, "zipcode")
            endereco.rua = rs.getString(alias, "rua")
            endereco.nro = rs.getLongOrNull(alias, "nro")
            endereco.cidade = rs.getString(alias, "cidade")
            endereco.uf = rs.getString(alias, "uf")
            endereco.latitude = rs.getDoubleOrNull(alias, "latitude")
            endereco.longitude = rs.getDoubleOrNull(alias, "longitude")
            return endereco
        }
    }
}
