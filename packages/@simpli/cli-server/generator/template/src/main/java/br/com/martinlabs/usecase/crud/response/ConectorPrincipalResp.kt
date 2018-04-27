package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.ConectorPrincipal
import br.com.martinlabs.usecase.model.Conectado
import br.com.martinlabs.usecase.model.Principal

@ApiModel(value = "ConectorPrincipalResp")
class ConectorPrincipalResp {

    var conectorPrincipal: ConectorPrincipal? = null

    @ApiModelProperty(value = "Possible Conectado values")
    var allConectado: MutableList<Conectado>? = null

    @ApiModelProperty(value = "Possible Principal values")
    var allPrincipal: MutableList<Principal>? = null
}
