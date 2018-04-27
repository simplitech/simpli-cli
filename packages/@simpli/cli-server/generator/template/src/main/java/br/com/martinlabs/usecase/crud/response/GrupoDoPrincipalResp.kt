package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.GrupoDoPrincipal

@ApiModel(value = "GrupoDoPrincipalResp")
class GrupoDoPrincipalResp {

    var grupoDoPrincipal: GrupoDoPrincipal? = null
}
