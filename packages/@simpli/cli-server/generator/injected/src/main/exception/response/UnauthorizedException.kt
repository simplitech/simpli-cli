<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * UnauthorizedException
 * @author Simpli CLI generator
 */
open class UnauthorizedException(message: String? = null)
    : HttpException(message ?: "Unauthorized", Response.Status.UNAUTHORIZED)
