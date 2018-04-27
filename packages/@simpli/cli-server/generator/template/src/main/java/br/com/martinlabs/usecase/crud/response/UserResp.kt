package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.User

@ApiModel(value = "UserResp")
class UserResp {

    var user: User? = null
}
