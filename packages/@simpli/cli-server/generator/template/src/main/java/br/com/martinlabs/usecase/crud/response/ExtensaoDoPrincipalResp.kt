package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.ExtensaoDoPrincipal
import br.com.martinlabs.usecase.model.Principal

@ApiModel(value = "ExtensaoDoPrincipalResp")
class ExtensaoDoPrincipalResp {

    var extensaoDoPrincipal: ExtensaoDoPrincipal? = null

    @ApiModelProperty(value = "Possible Principal values")
    var allPrincipal: MutableList<Principal>? = null
}
