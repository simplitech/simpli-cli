<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.request

import <%-packageAddress%>.<%-moduleName%>.auth.AuthProcess
import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty

/**
 * Authentication Request Model
 * @author Simpli CLI generator
 */
@ApiModel(value = "AuthRequest")
class AuthRequest(val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, val <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?) {
    @ApiModelProperty(hidden = true)
    fun toToken() = AuthProcess.requestToToken(this)
}
