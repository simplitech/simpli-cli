package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.Endereco

@ApiModel(value = "EnderecoResp")
class EnderecoResp {

    var endereco: Endereco? = null
}
