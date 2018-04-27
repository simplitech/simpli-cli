package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.ItemDoPrincipal
import br.com.martinlabs.usecase.model.Principal

@ApiModel(value = "ItemDoPrincipalResp")
class ItemDoPrincipalResp {

    var itemDoPrincipal: ItemDoPrincipal? = null

    @ApiModelProperty(value = "Possible Principal values")
    var allPrincipal: MutableList<Principal>? = null
}
