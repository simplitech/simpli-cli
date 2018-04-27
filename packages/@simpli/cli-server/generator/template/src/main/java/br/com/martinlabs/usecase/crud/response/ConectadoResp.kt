package br.com.martinlabs.usecase.crud.response

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import br.com.martinlabs.usecase.model.Conectado

@ApiModel(value = "ConectadoResp")
class ConectadoResp {

    var conectado: Conectado? = null
}
