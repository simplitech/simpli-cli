package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.model.GrupoDoPrincipal
import br.com.martinlabs.usecase.model.Tag

@ApiModel(value = "PrincipalResp")
class PrincipalResp {

    var principal: Principal? = null

    @ApiModelProperty(value = "Possible GrupoDoPrincipal values")
    var allGrupoDoPrincipal: MutableList<GrupoDoPrincipal>? = null

    @ApiModelProperty(value = "Possible Tag values")
    var allTag: MutableList<Tag>? = null
}
