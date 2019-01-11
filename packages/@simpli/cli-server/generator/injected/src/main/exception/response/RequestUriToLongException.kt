<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * RequestUriToLongException
 * @author Simpli CLI generator
 */
open class RequestUriToLongException(message: String? = null)
    : HttpException(message ?: "Request Uri To Long", Response.Status.REQUEST_URI_TOO_LONG)
