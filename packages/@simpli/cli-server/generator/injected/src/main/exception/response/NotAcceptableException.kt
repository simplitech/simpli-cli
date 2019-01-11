<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * NotAcceptableException
 * @author Simpli CLI generator
 */
open class NotAcceptableException(message: String? = null)
    : HttpException(message ?: "Not Acceptable", Response.Status.NOT_ACCEPTABLE)
