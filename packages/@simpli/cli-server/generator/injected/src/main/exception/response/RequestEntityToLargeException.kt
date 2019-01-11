<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * RequestEntityToLargeException
 * @author Simpli CLI generator
 */
open class RequestEntityToLargeException(message: String? = null)
    : HttpException(message ?: "Request Entity To Large", Response.Status.REQUEST_ENTITY_TOO_LARGE)
