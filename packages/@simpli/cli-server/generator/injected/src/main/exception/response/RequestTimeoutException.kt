<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * RequestTimeoutException
 * @author Simpli CLI generator
 */
open class RequestTimeoutException(message: String? = null)
    : HttpException(message ?: "Request Timeout", Response.Status.REQUEST_TIMEOUT)
