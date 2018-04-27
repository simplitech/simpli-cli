package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.model.Principal

@ApiModel(value = "TagResp")
class TagResp {

    var tag: Tag? = null

    @ApiModelProperty(value = "Possible Principal values")
    var allPrincipal: MutableList<Principal>? = null
}
