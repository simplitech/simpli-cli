<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.exception.response

import <%-packageAddress%>.exception.HttpException
import javax.ws.rs.core.Response

/**
 * NotFoundException
 * @author Simpli CLI generator
 */
open class NotFoundException(message: String? = null)
    : HttpException(message ?: "Not Found", Response.Status.NOT_FOUND)
