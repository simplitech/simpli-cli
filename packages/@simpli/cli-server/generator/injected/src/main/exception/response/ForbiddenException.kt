<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * ForbiddenException
 * @author Simpli CLI generator
 */
open class ForbiddenException(message: String? = null)
    : HttpException(message ?: "Forbidden", Response.Status.FORBIDDEN)
