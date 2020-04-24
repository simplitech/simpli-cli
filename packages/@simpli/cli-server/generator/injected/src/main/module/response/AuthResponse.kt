<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.response

import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import <%-packageAddress%>.<%-moduleName%>.socket.NotificationSocket
import io.swagger.v3.oas.annotations.media.Schema

/**
 * Authentication Response Model
 * @author Simpli CLI generator
 */
class AuthResponse(var token: String, var <%-userTable.instanceName%>: <%-userTable.modelName%>) {
    val id @Schema(hidden = true) get() = <%-userTable.instanceName%>.id
    val <%-accountColumn.name%> @Schema(hidden = true) get() = <%-userTable.instanceName%>.<%-accountColumn.name%>

    @Schema(hidden = true)
    fun sendNotification(content: String) {
        NotificationSocket.socket.send(content, id)
    }
}
