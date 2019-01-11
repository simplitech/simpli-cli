<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * ServiceUnavailableException
 * @author Simpli CLI generator
 */
open class ServiceUnavailableException(message: String? = null)
    : HttpException(message ?: "Service Unavailable", Response.Status.SERVICE_UNAVAILABLE)
