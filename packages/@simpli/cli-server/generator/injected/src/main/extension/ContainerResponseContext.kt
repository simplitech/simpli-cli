<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.extension

import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.core.Response

fun ContainerResponseContext.isFailure(): Boolean {
    return statusInfo.family != Response.Status.Family.SUCCESSFUL &&
            statusInfo.family != Response.Status.Family.INFORMATIONAL
}
