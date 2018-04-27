package br.com.martinlabs.usecase.crud.response

import br.com.martinlabs.usecase.model.User
import io.swagger.annotations.ApiModel

@ApiModel(value = "LoginResp")
class LoginResp(var token: String?, var id: Long, var user: User?)