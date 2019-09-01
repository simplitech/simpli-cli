<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.context

import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import <%-packageAddress%>.<%-moduleName%>.auth.AuthProcess
import <%-packageAddress%>.param.DefaultParam
import br.com.simpli.sql.AbstractConPipe

/**
 * Guest Pipe
 * Responsible to control the data which is entering into the server
 * @author Simpli CLI generator
 */
object GuestPipe {
    fun <T> handle(
            conPipe: AbstractConPipe,
            param: DefaultParam,
            callback: (context: RequestContext) -> T
    ): T {
        return conPipe.handle {
            callback(RequestContext(it, param))
        }
    }
}
