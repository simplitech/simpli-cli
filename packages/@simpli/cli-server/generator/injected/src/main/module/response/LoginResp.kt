<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
package <%-packageAddress%>.<%-moduleName%>.response

import <%-packageAddress%>.model.<%-userTable.modelName%>
import io.swagger.annotations.ApiModel

@ApiModel(value = "LoginResp")
class LoginResp(var token: String?, var id: Long, var <%-userTable.instanceName%>: <%-userTable.modelName%>?)
