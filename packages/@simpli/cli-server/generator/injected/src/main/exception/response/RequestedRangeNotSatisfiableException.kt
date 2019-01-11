<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * RequestedRangeNotSatisfiableException
 * @author Simpli CLI generator
 */
open class RequestedRangeNotSatisfiableException(message: String? = null)
    : HttpException(message ?: "Requested Range Not Satisfiable", Response.Status.REQUESTED_RANGE_NOT_SATISFIABLE)
